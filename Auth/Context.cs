using Microsoft.AspNetCore.Http;
using WebCommons.Db;
using WebCommons.Utils;

namespace WebCommons.Auth
{
    public enum AuthSource { None, Header, Cookie }
    public enum AuthType { None, Token, Credentials }

    /// <summary>
    /// Defines how the request user identifies himself.
    /// </summary>
    public class AuthContext<TUser> where TUser : CommonUser
    {
        public AuthSource Source { get; set; } = AuthSource.None;
        public AuthType Type { get; set; } = AuthType.None;

        public AuthCookie Cookie { get; set; } = new AuthCookie();
        public Guid? Token { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }

        public CommonDbContextWithAuth<TUser> Db { get; set; }

        private bool wasAuthProcessed = false;
        private TUser _user = null;
        public TUser User {
            get {
                if (!this.wasAuthProcessed && this.Db != null) {
                    this.Db.GetUser(this);
                    this.wasAuthProcessed = true;
                }

                return this._user;
            }
            set {
                this._user = value;
                this.wasAuthProcessed = true;
            }
        }

        /// <summary>
        /// Attempts to get the authentification information from the header or the cookie.
        /// </summary>
        public void Init(HttpRequest request, HttpResponse response, CommonDbContextWithAuth<TUser> db = null)
        {
            this.Db = db;

            // Header
            string? authHeader = request.Headers["Authorization"];
            if (!string.IsNullOrEmpty(authHeader)) {
                this.From(authHeader);
                return;
            }

            // Cookie
            this.Cookie.Init(request, response);
            this.Cookie.Read();
            if (this.Cookie.Exists() && this.Cookie.IsValid()) {
                this.From(this.Cookie);
            }
        }

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
        /// <exception cref="UnauthorizedException"></exception>
        public bool MustBeAuthenticated()
        {
            if (!this.IsAuthenticated()) { throw new UnauthorizedException(); }
            return true;
        }

        /// <summary>
        /// Authenticates the user.
        /// </summary>
        public void Authenticate(string email, string password)
        {
            TUser? user = this.Db.GetUser(email, password);
            this.Authenticate(user);
        }

        /// <summary>
        /// Authenticates the user.
        /// </summary>
        public void Authenticate(Guid token)
        {
            TUser? user = this.Db.GetUser(token);
            this.Authenticate(user);
        }

        /// <summary>
        /// Authenticates the user by creating the token if necessary and creating an auth cookie.
        /// </summary>
        public void Authenticate(TUser? user)
        {
            if (user == null) { return; }
            if (user.AuthTokenId == null) {
                WebCommons.Db.Token<TUser> token = new(user, this.Cookie.Duration, false);
                user.AuthTokenId = token.Id;
                this.Db.Tokens.Add(token);
                this.Db.Users.Update(user);
                this.Db.SaveChanges();
            }

            this.Cookie.Create(user.AuthTokenId.Value);
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
                    this.Email = credentials[0];
                    this.Password = credentials[1];
                    this.Type = AuthType.Credentials;
                    break;
                // Bearer type has GUID token
                case "Bearer":
                    Guid token;
                    if (!Guid.TryParse(values[1], out token)) { return; }
                    this.Token = token;
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
            this.Token = cookie.Token;
            this.Type = AuthType.Token;
            this.Source = AuthSource.Cookie;
        }
    }
}