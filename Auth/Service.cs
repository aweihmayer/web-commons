using Microsoft.AspNetCore.Mvc;
using WebCommons.Db;
using WebCommons.Dto;
using WebCommons.Http;

namespace WebCommons.Auth
{
    public class AuthService<TUser> where TUser : CommonUser
    {
        public CommonDbContextWithAuth<TUser> Db { get; set; }
        public Controller? Controller { get; set; }

        public AuthService(CommonDbContextWithAuth<TUser> db, Controller? controller = null) {
            this.Db = db;
            this.Controller = controller;
        }

        /// <summary>
        /// Signs-in a user.
        /// </summary>
        /// <exception cref="BadRequestException">Thrown if the email or password are empty.</exception>
        /// <exception cref="NotFoundException">Thrown if the user is not found.</exception>
        public TUser Signin(SigninModel model)
        {
            return this.Signin(model.Email, model.Password);
        }

        /// <summary>
        /// Signs-in a user.
        /// </summary>
        /// <exception cref="BadRequestException">Thrown if the email or password are empty.</exception>
        /// <exception cref="NotFoundException">Thrown if the user is not found.</exception>
        public TUser Signin(string? email, string? password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password)) { throw new BadRequestException(); }
            TUser? user = this.Db.FindUser(email, password);
            if (user == null) { throw new NotFoundException(); }
            return this.Signin(user);
        }

        /// <summary>
        /// Signs-in a user.
        /// </summary>
        /// <exception cref="NotFoundException">Thrown if the user is not found.</exception>
        public TUser Signin(TUser? user)
        {
            if (user == null) { throw new NotFoundException(); }

            // Create tokens
            UserToken<TUser> refreshToken = new(user, UserTokenType.Refresh, UserTokenDurations.Refresh);
            this.Db.Tokens.Add(refreshToken);
            user.RefreshToken = new UserTokenDto(refreshToken);

            UserToken<TUser> accessToken = new(user, UserTokenType.Refresh, UserTokenDurations.Refresh);
            this.Db.Tokens.Add(accessToken);
            user.AccessToken = new UserTokenDto(accessToken);

            // Save
            user.LastAuthDate = DateTime.UtcNow;
            this.Db.SaveChanges();
            if (this.Controller == null) { return user; }

            // Cookies
            if (user.RefreshToken != null) {
                RefreshTokenCookie refreshTokenCookie = new RefreshTokenCookie();
                refreshTokenCookie.Value = user.RefreshToken.Id;
                this.Controller.Response.Cookies.Create(refreshTokenCookie);
            }

            if (user.AccessToken != null) {
                AccessTokenCookie accessTokenCookie = new AccessTokenCookie();
                accessTokenCookie.Value = user.AccessToken.Id;
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
            if (!refreshToken.HasValue) { throw new BadRequestException(); }
            UserToken<TUser>? token = this.Db.FindToken(refreshToken.Value, true);
            if (token == null || token.User == null) { throw new NotFoundException(); }
            token.Expire();
            return this.Signin(token.User);
        }

        #region Revocation

        /// <summary>
        /// Revokes a user's token.
        /// </summary>
        /// <exception cref="NotFoundException">Thrown if the token is not found.</exception>
        public void RevokeToken(Guid tokenId)
        {
            UserToken<TUser>? token = this.Db.FindToken(tokenId);
            if (token == null) { throw new NotFoundException(); }
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
            UserToken<TUser>? token = this.Db.FindToken(tokenId, true);
            if (token == null || token.User == null) { throw new NotFoundException(); }
            List<UserToken<TUser>> tokens = this.Db.FetchTokens(token.User);
            foreach (UserToken<TUser> t in tokens) { t.Expire(); }
            this.Db.SaveChanges();
        }

        #endregion
    }
}
