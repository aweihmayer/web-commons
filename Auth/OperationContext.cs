using Microsoft.AspNetCore.Mvc;
using WebCommons.Auth;
using WebCommons.Db;
using WebCommons.Web;

namespace WebCommons.Controllers
{
    /// <summary>
    /// Defines how the request user identifies himself.
    /// </summary>
    public partial class OperationContext<TDb, TUser> where TDb : CommonDbContextWithAuth<TUser>, new() where TUser : CommonUser
    {
        #region Request values

        private Controller? _controller = null;
        public Controller? Controller
        {
            get {
                return this._controller;
            }
            set {
                this._controller = value;

                // Header
                string? authHeader = value.Request.Headers.Authorization;
                if (!string.IsNullOrEmpty(authHeader)) {
                    this.PopulateAuthValueFromHeader(authHeader);
                    return;
                }

                // Cookie
                var accessTokenCookie = value.Request.Cookies.Read<AccessTokenCookie>();
                var refreshTokenCookie = value.Request.Cookies.Read<RefreshTokenCookie>();
                this.PopulateAuthValueFromCookie(accessTokenCookie, refreshTokenCookie);
            }
        }

        public AuthSource AuthSource { get; set; } = AuthSource.None;
        public AuthMethod AuthMethod { get; set; } = AuthMethod.None;
        
        public Guid? RequestAccessToken { get; set; }
        public Guid? RequestRefreshToken { get; set; }
        public string? RequestEmail { get; set; }
        public string? RequestPassword { get; set; }

        /// <summary>
        /// Determines the auth values from a header.
        /// </summary>
        private void PopulateAuthValueFromHeader(string header)
        {
            // Splits the header to seperate the value from the type. For example 'Basic <TOKEN>'
            string[] values = header.Trim().Split(' ');
            if (values.Length == 2)
            {
                switch (values[0])
                {
                    // Basic type has credentials separated by a colon as email:password
                    case "Basic":
                        string[] credentials = values[1].DecodeBase64().Split(':');
                        if (credentials.Length != 2) { return; }
                        this.RequestEmail = credentials[0];
                        this.RequestPassword = credentials[1];
                        this.AuthMethod = AuthMethod.Credentials;
                        break;
                    // Bearer type has GUID token
                    case "Bearer":
                        Guid token;
                        if (!Guid.TryParse(values[1], out token)) { return; }
                        this.RequestAccessToken = token;
                        this.AuthMethod = AuthMethod.Token;
                        break;
                    default:
                        return;
                }
            } else if (values.Length == 1) {
                Guid token;
                if (!Guid.TryParse(values[0], out token)) { return; }
                this.RequestAccessToken = token;
                this.AuthMethod = AuthMethod.Token;
            } else {
                return;
            }

            this.AuthSource = AuthSource.Header;
        }

        /// <summary>
        /// Determines the auth values from an auth cookie.
        /// </summary>
        public void PopulateAuthValueFromCookie(AccessTokenCookie accessCookie, RefreshTokenCookie refreshCookie)
        {
            if (!accessCookie.IsEmpty()) {
                this.RequestAccessToken = accessCookie.Value;
                this.AuthMethod = AuthMethod.Token;
                this.AuthSource = AuthSource.Cookie;
            }

            if (!refreshCookie.IsEmpty()) {
                this.RequestAccessToken = refreshCookie.Value;
            }
        }

        #endregion

        #region Request user

        private bool wasUserFetched = false;
        private TUser? _user = null;
        public TUser? User {
            get {
                if (this.wasUserFetched) { return this._user; }

                switch (this.AuthMethod) {
                    case AuthMethod.Token:
                        UserToken<TUser>? accessToken = this.Db.FindToken(this.RequestAccessToken, true);
                        if (accessToken == null) { this._user = null; break; }
                        if (!accessToken.IsExpired()) { return accessToken.User; }

                        if (!this.RequestRefreshToken.HasValue) { this._user = null; break; }
                        UserToken<TUser>? refreshToken = this.Db.FindToken(this.RequestRefreshToken, true);
                        if (refreshToken == null || refreshToken.UserId != accessToken.UserId || refreshToken.IsExpired()) { this._user = null; break; }
                        accessToken.Id = Guid.NewGuid();
                        accessToken.Refresh();
                        this.Db.SaveChanges();

                        var cookie = this.Controller.Request.Cookies.Read<AccessTokenCookie>();
                        cookie.Value = accessToken.Id;
                        this.Controller.Response.Cookies.Create(cookie);
                        break;
                    case AuthMethod.Credentials:
                        break;
                }

                this.wasUserFetched = true;
                return this._user;
            }
            set {
                this.wasUserFetched = true;
                this._user = value;
            }
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
        /// <exception cref="BadRequestException">Thrown if the email or password are empty.</exception>
        public TUser Authenticate(string? email, string? password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password)) { throw new BadRequestException(); }
            TUser? user = this.Db.FindUser(email, password);
            if (user == null) { throw new NotFoundException(); }
            return this.Authenticate(user);
        }

        /// <summary>
        /// Authenticates the user by creating the token if necessary and creating an auth cookie.
        /// </summary>
        public TUser Authenticate(TUser? user)
        {
            if (user == null) { throw new NotFoundException(); }

            if (!user.RefreshTokenId.HasValue) {
                UserToken<TUser>? refreshToken = this.Db.FindToken(user, UserTokenType.Refresh);
                if (refreshToken == null) {
                    refreshToken = new(user, UserTokenType.Refresh);
                    this.Db.Tokens.Add(refreshToken);
                } else {
                    refreshToken.Refresh();
                }
                
                user.RefreshTokenId = refreshToken.Id;
            }

            if (!user.AccessTokenid.HasValue) {
                UserToken<TUser>? accessToken = this.Db.FindToken(user, UserTokenType.Access);
                if (accessToken == null) {
                    accessToken = new(user, UserTokenType.Access, AccessTokenCookie.DURATION);
                    this.Db.Tokens.Add(accessToken);
                }

                user.AccessTokenid = accessToken.Id;
            }

            user.LastAuthDate = DateTime.UtcNow;
            this.Db.SaveChanges();

            if (this.Controller == null) { return user; }

            var refreshTokenCookie = this.Controller.Request.Cookies.Read<RefreshTokenCookie>();
            if (refreshTokenCookie.IsEmpty() || refreshTokenCookie.Value != user.RefreshTokenId) {
                refreshTokenCookie.Value = user.RefreshTokenId.Value;
                this.Controller.Response.Cookies.Create(refreshTokenCookie);
            }

            AccessTokenCookie accessTokenCookie = new AccessTokenCookie();
            accessTokenCookie.Value = user.AccessTokenid;
            this.Controller.Response.Cookies.Create(accessTokenCookie);

            return user;
        }

        #endregion
    }
}