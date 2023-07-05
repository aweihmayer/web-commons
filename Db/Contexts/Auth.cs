using Microsoft.EntityFrameworkCore;
using WebCommons.Auth;

namespace WebCommons.Db
{
    /// <summary>
    /// Defines a custom DB context able to handle user authentification.
    /// </summary>
    public abstract class CommonDbContextWithAuth<TUser> : CommonDbContext where TUser : CommonUser
    {
        public DbSet<TUser> Users { get; set; }
        public DbSet<Token<TUser>> Tokens { get; set; }

        /// <summary>
        /// Finds a user with an auth context.
        /// </summary>
        public TUser? GetUser(AuthContext<TUser> context)
        {
            switch (context.Type) {
                case AuthType.Token:
                    if (!context.Token.HasValue) { return null; }
                    return this.GetUser(context.Token.Value);
                case AuthType.Credentials:
                    if (string.IsNullOrEmpty(context.Email) || string.IsNullOrEmpty(context.Password)) { return null; }
                    return this.GetUser(context.Email, context.Password);
                default:
                    return null;
            }
        }

        /// <summary>
        /// Finds a user with their auth token.
        /// </summary>
        public TUser? GetUser(Guid token)
        {
            Token<TUser>? tokenEntity = this.Tokens.FirstOrDefault(t => t.Id == token);
            if (tokenEntity == null) { return null; }
            return tokenEntity.User;
        }

        /// <summary>
        /// Finds a user with their credentials.
        /// </summary>
        public TUser? GetUser(string email, string password)
        {
            TUser? user = this.Users.FirstOrDefault(u => u.Email == email);
            if (user == null) { return null; }
            if (password.IsValidPassword(user)) { return user; }
            return null;
        }
    }
}
 