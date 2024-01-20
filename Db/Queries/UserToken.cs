using Microsoft.EntityFrameworkCore;

namespace WebCommons.Db
{
    public static class UserTokenQueryExtensions
    {
        public static IQueryable<UserToken<T>> WhereIsNotExpired<T>(this IQueryable<UserToken<T>> query) where T : CommonUser
        {
            return query.Where(t => !t.ExpirationDate.HasValue || t.ExpirationDate >= DateTime.UtcNow);
        }

        /// <summary>
        /// Builds the base token query.
        /// </summary>
        public static IQueryable<UserToken<T>> WhereTokenBelongsToUser<T>(this DbSet<UserToken<T>> dbset, T user, UserTokenType? type, bool includeUsers = false) where T : CommonUser
        {
            var query = includeUsers
                ? dbset.Include(t => t.User)
                : dbset.AsQueryable();
            query = query.Where(t => t.UserId == user.Id).WhereIsNotExpired();
            if (type.HasValue) query = query.Where(t => t.Type == type);
            return query;
        }
    }
}
