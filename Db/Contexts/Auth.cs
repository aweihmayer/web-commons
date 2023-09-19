using Microsoft.EntityFrameworkCore;
using WebCommons.Auth;
using WebCommons.Dto;

namespace WebCommons.Db
{
    /// <summary>
    /// Defines a custom DB context able to handle user authentification.
    /// </summary>
    public class CommonDbContextWithAuth<TUser> : CommonDbContext where TUser : CommonUser
    {
        public CommonDbContextWithAuth() { }

        public CommonDbContextWithAuth(DbContextOptions options) : base(options) { }

        #region Users

        public DbSet<TUser> Users { get; set; }

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
            if (!token.HasValue) { return default; }
            UserToken<TUser>? userToken = this.FindToken(token, true); // TODO check sql query generated
            if (userToken == null || userToken.IsExpired() || userToken.User == null) { return default; }
            TUser user = userToken.User;

            switch (tokenType) {
                case UserTokenType.Access: user.AccessToken = new UserTokenDto(userToken); break;
                case UserTokenType.Refresh: user.RefreshToken = new UserTokenDto(userToken); break;
            }

            // Include alt token if applicable
            if (!includeTokens) { return user; }

            UserToken<TUser>? altToken = null;
            switch (tokenType) {
                case UserTokenType.Access:
                    altToken = this.FindToken(user, UserTokenType.Refresh);
                    if (altToken == null) { return user; }
                    user.RefreshToken = new UserTokenDto(altToken);
                    break;
                case UserTokenType.Refresh:
                    altToken = this.FindToken(user, UserTokenType.Access);
                    if (altToken == null) { return user; }
                    user.AccessToken = new UserTokenDto(altToken);
                    break;
            }

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
 