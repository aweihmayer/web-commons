using Microsoft.EntityFrameworkCore;
using WebCommons.Auth;

namespace WebCommons.Db
{
    /// <summary>
    /// Defines a custom DB context able to handle user authentification.
    /// </summary>
    public abstract class CommonDbContextWithAuth<TUser> : CommonDbContext where TUser : CommonUser
    {
        #region Users

        public DbSet<TUser> Users { get; set; }

        /// <summary>
        /// Finds a user with their auth token.
        /// </summary>
        public TUser? GetUser(Guid? token)
        {
            if (!token.HasValue) { return default; }
            UserToken<TUser>? tokenEntity = this.Tokens.Include(t => t.User).FirstOrDefault(t => t.Id == token); // TODO check sql query generated
            // TODO check expiration
            if (tokenEntity == null || tokenEntity.User == null) { return null; }
            tokenEntity.User.AuthTokenId = token;
            return tokenEntity.User;
        }

        /// <summary>
        /// Finds a user with their credentials.
        /// </summary>
        public TUser? GetUser(string? email, string? password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password)) { return default; }
            TUser? user = this.Users.FirstOrDefault(u => u.Email == email);
            if (user == null) { return null; }
            if (password.IsValidPassword(user)) { return user; }
            return null;
        }

        #endregion

        #region Tokens

        public DbSet<UserToken<TUser>> Tokens { get; set; }

        public UserToken<TUser>? GetToken(TUser user)
        {
            return this.GetToken(user.Id);
        }

        public UserToken<TUser>? GetAuthToken(TUser user)
        {
            return this.GetAuthToken(user.Id);
        }

        public UserToken<TUser>? GetToken(int userId)
        {
            return this.Tokens.FirstOrDefault(t => t.UserId == userId);
        }

        public UserToken<TUser>? GetAccessToken(int userId)
        {
            return this.Tokens.FirstOrDefault(t => t.UserId == userId && t.IsAuthToken);
        }

        public UserToken<TUser>? GetToken(Guid? id, bool includeUser = false)
        {
            return this.Tokens.FirstOrDefault(t => t.Id == id);
        }

        public UserToken<TUser>? GetAccessToken(Guid id)
        {
            return this.Tokens.FirstOrDefault(t => t.Id == id && t.IsAuthToken);
        }

        #endregion
    }
}
 