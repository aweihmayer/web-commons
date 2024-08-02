using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebCommons.Db;
using WebCommons.Dto;
using WebCommons.Http;

namespace WebCommons.Auth
{
    public abstract class CommonAuthService<TUser> where TUser : CommonUser
    {
        public CommonDbContextWithAuth<TUser> Db { get; set; }
        public Controller? Controller { get; set; }

        public CommonAuthService(CommonDbContextWithAuth<TUser> db, Controller? controller = null) {
            this.Db = db;
            this.Controller = controller;
        }

        #region Users - Fetching

        /// <summary>
        /// Finds a user with their access token.
        /// </summary>
        public TUser? FindUserByAccessToken(Guid? token, bool includeTokens = false)
        {
            return this.FindUserByToken(token, UserTokenType.Access, includeTokens);
        }

        /// <summary>
        /// Finds a user with their refresh token.
        /// </summary>
        public TUser? FindUserByRefreshToken(Guid? token, bool includeTokens = false)
        {
            return this.FindUserByToken(token, UserTokenType.Refresh, includeTokens);
        }

        /// <summary>
        /// Finds a user with a token.
        /// </summary>
        protected TUser? FindUserByToken(Guid? token, UserTokenType tokenType, bool includeTokens = false)
        {
            // Find the access token with the user
            if (!token.HasValue) return default;
            UserToken<TUser>? userToken = this.FindToken(token.Value, true);
            if (userToken == null || userToken.IsExpired() || userToken.User == null) return default;
            TUser? user = userToken.User;
            if (user == null) return default;

            // Create the token relationships for the user
            UserTokenType altTokenType = tokenType;
            switch (tokenType) {
                case UserTokenType.Access: 
                    user.AccessToken = new UserTokenDto(userToken);
                    altTokenType = UserTokenType.Refresh;
                    break;
                case UserTokenType.Refresh:
                    user.RefreshToken = new UserTokenDto(userToken);
                    altTokenType = UserTokenType.Access;
                    break;
            }

            // Include alt token if applicable
            if (!includeTokens) return user;
            UserToken<TUser>? altToken = this.FindToken(user, altTokenType);
            if (altToken == null) return user;
            else if (altTokenType == UserTokenType.Access) user.AccessToken = new UserTokenDto(altToken);
            else user.RefreshToken = new UserTokenDto(altToken);

            return user;
        }

        /// <summary>
        /// Finds a user with their credentials.
        /// </summary>
        public TUser? FindUser(string? email, string? password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password)) return default;
            TUser? user = this.Db.Users.FirstOrDefault(u => u.Email == email);
            if (user == null) return null;
            else if (AuthUtils.VerifyEncryptedValue(password, user)) return user;
            else return null;
        }

        #endregion

        #region Tokens - Fetching

        /// <summary>
        /// Fetches all tokens for a user.
        /// </summary>
        public List<UserToken<TUser>> FetchTokens(TUser user, bool includeUsers = false)
        {
            return this.Db.Tokens.WhereTokenBelongsToUser(user, null, includeUsers).ToList();
        }

        /// <summary>
        /// Fetches tokens with a type for a user.
        /// </summary>
        public List<UserToken<TUser>> FetchTokens(TUser user, UserTokenType? type, bool includeUsers = false)
        {
            return this.Db.Tokens.WhereTokenBelongsToUser(user, type, includeUsers).ToList();
        }

        /// <summary>
        /// Fetches a token with a type for a user.
        /// </summary>
        public UserToken<TUser>? FindToken(TUser user, UserTokenType? type, bool includeUsers = false)
        {
            return this.Db.Tokens.WhereTokenBelongsToUser(user, type, includeUsers).FirstOrDefault();
        }

        /// <summary>
        /// Finds a token by id.
        /// </summary>
        public UserToken<TUser>? FindToken(Guid id, bool includeUser = false)
        {
            var query = includeUser
                ? this.Db.Tokens.Include(t => t.User)
                : this.Db.Tokens.AsQueryable();

            string encryptedId = AuthUtils.Encrypt(id);
            return query.Where(t => t.EncryptedId == encryptedId).WhereIsNotExpired().FirstOrDefault();
        }

        #endregion

        #region Token - Issuing

        /// <summary>
        /// Signs-in a user.
        /// </summary>
        /// <exception cref="BadRequestException">Thrown if the email or password are empty.</exception>
        /// <exception cref="NotFoundException">Thrown if the user is not found.</exception>
        public TUser Signin(string? email, string? password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password)) throw new BadRequestException();
            TUser? user = this.FindUser(email, password);
            if (user == null) throw new NotFoundException();
            else return this.Signin(user);
        }

        /// <summary>
        /// Signs-in a user.
        /// </summary>
        /// <exception cref="NotFoundException">Thrown if the user is not found.</exception>
        public TUser Signin(TUser? user)
        {
            if (user == null) throw new NotFoundException();

            // Create tokens
            UserToken<TUser> refreshToken = new(user, UserTokenType.Refresh, UserTokenDurations.Refresh);
            this.Db.Tokens.Add(refreshToken);
            user.RefreshToken = new UserTokenDto(refreshToken);

            UserToken<TUser> accessToken = new(user, UserTokenType.Access, UserTokenDurations.Access);
            this.Db.Tokens.Add(accessToken);
            user.AccessToken = new UserTokenDto(accessToken);

            // Save
            user.LastAuthDate = DateTime.UtcNow;
            this.Db.SaveChanges();
            if (this.Controller == null) return user;

            // Cookies
            if (user.RefreshToken != null) {
                RefreshTokenCookie refreshTokenCookie = new() { Value = user.RefreshToken.Id };
                this.Controller.Response.Cookies.Create(refreshTokenCookie);
            }

            if (user.AccessToken != null) {
                AccessTokenCookie accessTokenCookie = new() { Value = user.AccessToken.Id };
                this.Controller.Response.Cookies.Create(accessTokenCookie);
            }

            return user;
        }

        /// <summary>
        /// Refreshes a user's access token and revokes the refresh token.
        /// </summary>
        /// <exception cref="NotFoundException">Thrown if the user or token is not found.</exception>
        public TUser RefreshToken(Guid? refreshToken)
        {
            if (!refreshToken.HasValue) throw new BadRequestException();
            UserToken<TUser>? token = this.FindToken(refreshToken.Value, true);
            if (token == null || token.User == null) throw new NotFoundException();
            token.Expire();
            return this.Signin(token.User);
        }

        #endregion

        #region Token revocation

        /// <summary>
        /// Revokes a user's token.
        /// </summary>
        /// <exception cref="NotFoundException">Thrown if the token is not found.</exception>
        public void RevokeToken(Guid tokenId)
        {
            UserToken<TUser>? token = this.FindToken(tokenId) ?? throw new NotFoundException();
            token.Expire();
            this.Db.SaveChanges();
        }


        /// <summary>
        /// Revokes all a user's tokens.
        /// </summary>
        /// <param name="tokenId">The token id. It can be any kind of token as long as it is associated to a user.</param>
        /// <exception cref="NotFoundException">Thrown if the user or token is not found.</exception>
        public void RevokeAllUserTokens(Guid tokenId)
        {
            UserToken<TUser>? token = this.FindToken(tokenId, true);
            if (token == null || token.User == null) throw new NotFoundException();
            List<UserToken<TUser>> tokens = this.FetchTokens(token.User);
            foreach (UserToken<TUser> t in tokens) t.Expire();
            this.Db.SaveChanges();
        }

        #endregion
    }
}
