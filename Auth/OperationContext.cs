using Microsoft.AspNetCore.Mvc;
using WebCommons.Auth;
using WebCommons.Db;
using WebCommons.Http;

namespace WebCommons.Controllers
{
    /// <summary>
    /// Defines how the request user identifies himself.
    /// </summary>
    public partial class CommonOperationContext<TDb, TUser> where TDb : CommonDbContextWithAuth<TUser>, new() where TUser : CommonUser
    {
        #region Request values

        public AuthSource AuthSource { get; set; } = AuthSource.None;
        public AuthMethod AuthMethod { get; set; } = AuthMethod.None;

        public Guid? AccessToken { get; set; }
        public Guid? RefreshToken { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }

        private Controller? _controller = null;
        public Controller? Controller
        {
            get => this._controller;
            set {
                this._controller = value;
                if (value == null) return;

                string timeOffsetHeader = value.Request.Headers["Time-Offset"];
                if (!string.IsNullOrEmpty(timeOffsetHeader)) {
                    TimeSpan timeOffset = TimeSpan.FromMinutes(Int32.Parse(timeOffsetHeader));
                    this.Date = new DateTimeOffset(DateTime.UtcNow.Add(timeOffset));
                }

                // Authentication was done with header
                string? authHeader = value.Request.Headers.Authorization;
                if (!string.IsNullOrEmpty(authHeader)) {
                    this.PopulateAuthValueFromHeader(authHeader);
                }
                // Authentication was done with cookie
                else {
                    var accessTokenCookie = value.Request.Cookies.Read<AccessTokenCookie>();
                    var refreshTokenCookie = value.Request.Cookies.Read<RefreshTokenCookie>();
                    this.PopulateAuthValueFromCookie(accessTokenCookie, refreshTokenCookie);
                }
            }
        }

        /// <summary>
        /// Determines the auth values from a header.
        /// </summary>
        protected void PopulateAuthValueFromHeader(string header)
        {
            // Splits the header to seperate the value from the type. For example 'Basic <TOKEN>'
            string[] values = header.Trim().Split(' ');
            if (values.Length == 2) {
                switch (values[0]) {
                    // Basic type has credentials separated by a colon as email:password
                    case "Basic":
                        string[] credentials = values[1].DecodeBase64().Split(':');
                        if (credentials.Length != 2) return;
                        this.Email = credentials[0];
                        this.Password = credentials[1];
                        this.AuthMethod = AuthMethod.Credentials;
                        break;
                    // Bearer type has GUID token
                    case "Bearer":
                        Guid token;
                        if (!Guid.TryParse(values[1], out token)) return;
                        this.AccessToken = token;
                        this.AuthMethod = AuthMethod.Token;
                        break;
                    default:
                        return;
                }
            } else if (values.Length == 1) {
                if (!Guid.TryParse(values[0], out Guid token)) return;
                this.AccessToken = token;
                this.AuthMethod = AuthMethod.Token;
            } else {
                return;
            }

            this.AuthSource = AuthSource.Header;
        }

        /// <summary>
        /// Determines the auth values from an auth cookie.
        /// </summary>
        protected void PopulateAuthValueFromCookie(AccessTokenCookie? accessCookie, RefreshTokenCookie? refreshCookie)
        {
            if ((accessCookie != null && !accessCookie.IsEmpty())
            || (refreshCookie != null && !refreshCookie.IsEmpty())) {
                this.AuthMethod = AuthMethod.Token;
                this.AuthSource = AuthSource.Cookie;
            }

            if (accessCookie != null && !accessCookie.IsEmpty()) {
                this.AccessToken = accessCookie.Value;
            }

            if (refreshCookie != null && !refreshCookie.IsEmpty()) {
                this.AccessToken = refreshCookie.Value;
            }
        }

        #endregion

        #region Request user

        private bool wasUserFetched = false;
        private TUser? _user = null;
        public TUser? User {
            get {
                if (this.wasUserFetched) return this._user;

                switch (this.AuthMethod) {
                    case AuthMethod.Token:
                        UserToken<TUser>? accessToken = this.Db.FindToken(this.AccessToken.Value, true);
                        if (accessToken == null) {
                            this.wasUserFetched = true;
                            this._user = null;
                        } else if (!accessToken.IsExpired()) {
                            this.wasUserFetched = true;
                            this._user = accessToken.User;
                        }
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

        public AuthService<TUser> CreateAuthService()
        {
            return new AuthService<TUser>(this.Db, this.Controller);
        }

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
            if (!this.IsAuthenticated()) throw new UnauthorizedException();
            else return true;
        }

        #endregion
    }
}