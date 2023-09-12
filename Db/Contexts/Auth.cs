using Microsoft.EntityFrameworkCore;
using WebCommons.Auth;

namespace WebCommons.Db
{
    /// <summary>
    /// Defines a custom DB context able to handle user authentification.
    /// </summary>
    public class CommonDbContextWithAuth<TUser> : CommonDbContext where TUser : CommonUser
    {
        #region Users

        public DbSet<TUser> Users { get; set; }

        /// <summary>
        /// Finds a user with their auth token.
        /// </summary>
        public TUser? FindUser(Guid? accessTokenId, bool includeTokens = false)
        {
            // Find the access token with the user
            if (!accessTokenId.HasValue) { return default; }
            UserToken<TUser>? accesstoken = this.FindToken(accessTokenId, true); // TODO check sql query generated
            if (accesstoken == null || accesstoken.IsExpired() || accesstoken.User == null) { return default; }
            TUser user = accesstoken.User;
            user.AccessTokenId = accesstoken.Id;

            // Include refresh token if applicable
            if (!includeTokens) { return user; }
            UserToken<TUser>? refreshToken = this.FindToken(user, UserTokenType.Refresh);
            if (refreshToken == null) { return user; }
            user.RefreshTokenId = refreshToken.Id;
            return user;
        }

        /// <summary>
        /// Finds a user with their credentials.
        /// </summary>
        public TUser? FindUser(string? email, string? password)
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

        /// <summary>
        /// Builds the base token query.
        /// </summary>
        private IQueryable<UserToken<TUser>> FetchTokensQuery(TUser user, UserTokenType? type, bool includeUsers = false)
        {
            var query = includeUsers
                ? this.Tokens.Include(t => t.User)
                : this.Tokens.AsQueryable();
            query = query.Where(t => t.UserId == user.Id).WhereIsNotExpired();
            if (type.HasValue) { query = query.Where(t => t.Type == type); }
            return query;
        }

        /// <summary>
        /// Fetches all tokens for a user.
        /// </summary>
        public List<UserToken<TUser>> FetchTokens(TUser user, bool includeUsers = false)
        {
            return this.FetchTokensQuery(user, null, includeUsers).ToList();
        }

        /// <summary>
        /// Fetches tokens with a type for a user.
        /// </summary>
        public List<UserToken<TUser>> FetchTokens(TUser user, UserTokenType? type, bool includeUsers = false)
        {
            return this.FetchTokensQuery(user, type, includeUsers).ToList();
        }

        /// <summary>
        /// Fetches a token with a type for a user.
        /// </summary>
        public UserToken<TUser>? FindToken(TUser user, UserTokenType? type, bool includeUsers = false)
        {
            return this.FetchTokensQuery(user, type, includeUsers).FirstOrDefault();
        }

        /// <summary>
        /// Finds a token by id.
        /// </summary>
        public UserToken<TUser>? FindToken(Guid? id, bool includeUser = false)
        {
            var query = includeUser
                ? this.Tokens.Include(t => t.User)
                : this.Tokens.AsQueryable();
            return query.Where(t => t.Id == id).WhereIsNotExpired().FirstOrDefault(); // TODO check sql generated
        }

        #endregion
    }
}
 