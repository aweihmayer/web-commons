using Microsoft.AspNetCore.Http;
using WebCommons.Auth;
using WebCommons.Db;

namespace WebCommons.Controllers
{
    /// <summary>
    /// Defines how the request user identifies himself.
    /// </summary>
    public partial class OperationContext<TDb, TUser> where TDb : CommonDbContext where TUser : CommonUser
    {
        public AuthSource Source { get; set; } = AuthSource.None;
        public AuthType Type { get; set; } = AuthType.None;

        public AuthCookie Cookie { get; set; } = new AuthCookie();
        public Guid? RequestToken { get; set; }
        public string? RequestEmail { get; set; }
        public string? RequestPassword { get; set; }

        public TDb? Db { get; set; }

        private bool wasAuthProcessed = false;
        private TUser? _user = null;
        public TUser? User {
            get {
                if (!this.wasAuthProcessed && this.Db != null && this.Db is CommonDbContextWithAuth<TUser>) {
                    CommonDbContextWithAuth<TUser> db = this.Db as CommonDbContextWithAuth<TUser>;
                    switch (this.Type) {
                        case AuthType.Token:        this._user = db.GetUser(this.RequestToken); break;
                        case AuthType.Credentials:  this._user = db.GetUser(this.RequestEmail, this.RequestPassword); break;
                    }
                    this.wasAuthProcessed = true;
                }

                return this._user;
            }
            set {
                this._user = value;
                this.wasAuthProcessed = true;
            }
        }

        #region Construction

        /// <summary>
        /// Attempts to get the authentification information from the header or the cookie.
        /// </summary>
        public void Init(HttpRequest request, HttpResponse response)
        {
            // Header
            string? authHeader = request.Headers["Authorization"];
            if (!string.IsNullOrEmpty(authHeader))
            {
                this.From(authHeader);
                return;
            }

            // Cookie
            this.Cookie.Init(request, response);
            this.Cookie.Read();
            if (this.Cookie.Exists() && this.Cookie.IsValid())
            {
                this.From(this.Cookie);
            }
        }

        /// <summary>
        /// Determines the auth values from a header.
        /// </summary>
        public void From(string header)
        {
            // Splits the header to seperate the value from the type. For example 'Basic <TOKEN>'
            string[] values = header.Trim().Split(' ');
            if (values.Length != 2) { return; }
            switch (values[0]) {
                // Basic type has credentials separated by a colon as email:password
                case "Basic":
                    string[] credentials = values[1].DecodeBase64().Split(':');
                    if (credentials.Length != 2) { return; }
                    this.RequestEmail = credentials[0];
                    this.RequestPassword = credentials[1];
                    this.Type = AuthType.Credentials;
                    break;
                // Bearer type has GUID token
                case "Bearer":
                    Guid token;
                    if (!Guid.TryParse(values[1], out token)) { return; }
                    this.RequestToken = token;
                    this.Type = AuthType.Token;
                    break;
                default:
                    return;
            }

            this.Source = AuthSource.Header;
        }

        /// <summary>
        /// Determines the auth values from an auth cookie.
        /// </summary>
        public void From(AuthCookie cookie)
        {
            if (!cookie.IsValid()) { return; }
            this.RequestToken = cookie.Token;
            this.Type = AuthType.Token;
            this.Source = AuthSource.Cookie;
        }

        #endregion

        #region Authentication

        /// <summary>
        /// Determines if the user was successfully authenticated.
        /// </summary>
        public bool IsAuthenticated()
        {
            return (this.User != null);
        }

        /// <summary>
        /// Determines if the user is authenticated and throws an exception if he is not, otherwise returns true.
        /// </summary>
        /// <exception cref="UnauthorizedException">Thrown if the user is not authenticated.</exception>
        public bool MustBeAuthenticated()
        {
            if (!this.IsAuthenticated()) { throw new UnauthorizedException(); }
            return true;
        }

        /// <summary>
        /// Authenticates the user.
        /// </summary>
        public TUser? Authenticate(SigninModel model)
        {
            return this.Authenticate(model.Email, model.Password);
        }

        /// <summary>
        /// Authenticates the user.
        /// </summary>
        public TUser? Authenticate(string? email, string? password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password)) { return default; }
            if (this.Db == null || this.Db is not CommonDbContextWithAuth<TUser>) { return default; }
            CommonDbContextWithAuth<TUser> db = this.Db as CommonDbContextWithAuth<TUser>;
            TUser? user = db.GetUser(email, password);
            this.Authenticate(user);
            return user;
        }

        /// <summary>
        /// Authenticates the user.
        /// </summary>
        public TUser? Authenticate(Guid token)
        {
            if (this.Db == null || this.Db is not CommonDbContextWithAuth<TUser>) { return default; }
            CommonDbContextWithAuth<TUser> db = this.Db as CommonDbContextWithAuth<TUser>;
            TUser? user = db.GetUser(token);
            this.Authenticate(user);
            return user;
        }

        /// <summary>
        /// Authenticates the user by creating the token if necessary and creating an auth cookie.
        /// </summary>
        public void Authenticate(TUser? user)
        {
            if (user == null) { return; }
            if (user.AuthTokenId == null) {
                if (this.Db == null || this.Db is not CommonDbContextWithAuth<TUser>) { return; }
                CommonDbContextWithAuth<TUser> db = this.Db as CommonDbContextWithAuth<TUser>;
                UserToken<TUser>? token = db.GetAuthToken(user);
                if (token == null) {
                    token = new(user, this.Cookie.Duration, true, false);
                    user.AuthTokenId = token.Id;
                    db.Tokens.Add(token);
                    db.SaveChanges();
                } else {
                    user.AuthTokenId = token.Id;
                }
            }

            this.Cookie.Create(user.AuthTokenId.Value);
        }

        #endregion
    }
}