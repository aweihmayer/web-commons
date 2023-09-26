using Microsoft.AspNetCore.Mvc;
using WebCommons.Db;
using WebCommons.Dto;
using WebCommons.Web;

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

            // Fetch refresh token
            if (user.RefreshToken == null) {
                UserToken<TUser>? refreshToken = this.Db.FindToken(user, UserTokenType.Refresh);
                // The user doesn't have a refresh token, we create one
                if (refreshToken == null) {
                    refreshToken = new(user, UserTokenType.Refresh, UserTokenDurations.Refresh);
                    this.Db.Tokens.Add(refreshToken);
                // The user already has a refresh token, we refresh its duration if it has a third or less of its lifespan left
                } else if ((refreshToken.GetRemainingDuration() / UserTokenDurations.Refresh) < 0.3) {
                    refreshToken.Refresh();
                }
                
                user.RefreshToken = new UserTokenDto(refreshToken);
            }

            // Fetch access token
            if (user.AccessToken == null) {
                UserToken<TUser>? accessToken = this.Db.FindToken(user, UserTokenType.Access);
                // The user doesn't have an access token, we create one
                if (accessToken == null) {
                    accessToken = new(user, UserTokenType.Access, UserTokenDurations.Access);
                    this.Db.Tokens.Add(accessToken);
                }

                user.AccessToken = new UserTokenDto(accessToken);
            }

            user.LastAuthDate = DateTimeOffset.UtcNow;
            this.Db.SaveChanges();

            this.SetTokenCookies(user);

            return user;
        }

        /// <summary>
        /// Refreshes a user's access token.
        /// </summary>
        /// <exception cref="NotFoundException">Thrown if the user or token is not found.</exception>
        public TUser Refresh(Guid? refreshToken)
        {
            if (!refreshToken.HasValue) { throw new BadRequestException(); }
            TUser? user = this.Db.FindUserByRefreshToken(refreshToken);
            if (user == null) { throw new NotFoundException(); }
            return this.Signin(user);
        }

        private void SetTokenCookies(TUser user)
        {
            if (this.Controller == null) { return; }

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
        }

        /// <summary>
        /// Revokes a user's token.
        /// </summary>
        /// <param name="tokenId"></param>
        public void Revoke(Guid tokenId)
        {
            UserToken<TUser>? token = this.Db.FindToken(tokenId);
            if (token == null) { return; }
            token.Expire();
            this.Db.SaveChanges();
        }
    }
}
