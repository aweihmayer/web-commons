﻿using Microsoft.EntityFrameworkCore;
using WebCommons.Auth;
using WebCommons.Dto;

namespace WebCommons.Db
{
    /// <summary>
    /// Defines a custom DB context able to handle user authentication.
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
            TUser? user = this.Users.FirstOrDefault(u => u.Email == email);
            if (user == null) return null;
            if (AuthUtils.VerifyEncryptedValue(password, user)) return user;
            return null;
        }

        #endregion

        #region Tokens

        public DbSet<UserToken<TUser>> Tokens { get; set; }

        /// <summary>
        /// Fetches all tokens for a user.
        /// </summary>
        public List<UserToken<TUser>> FetchTokens(TUser user, bool includeUsers = false)
        {
            return this.Tokens.WhereTokenBelongsToUser(user, null, includeUsers).ToList();
        }

        /// <summary>
        /// Fetches tokens with a type for a user.
        /// </summary>
        public List<UserToken<TUser>> FetchTokens(TUser user, UserTokenType? type, bool includeUsers = false)
        {
            return this.Tokens.WhereTokenBelongsToUser(user, type, includeUsers).ToList();
        }

        /// <summary>
        /// Fetches a token with a type for a user.
        /// </summary>
        public UserToken<TUser>? FindToken(TUser user, UserTokenType? type, bool includeUsers = false)
        {
            return this.Tokens.WhereTokenBelongsToUser(user, type, includeUsers).FirstOrDefault();
        }

        /// <summary>
        /// Finds a token by id.
        /// </summary>
        public UserToken<TUser>? FindToken(Guid id, bool includeUser = false)
        {
            var query = includeUser
                ? this.Tokens.Include(t => t.User)
                : this.Tokens.AsQueryable();

            string encryptedId = AuthUtils.Encrypt(id);
            return query.Where(t => t.EncryptedId == encryptedId).WhereIsNotExpired().FirstOrDefault();
        }

        #endregion
    }
}