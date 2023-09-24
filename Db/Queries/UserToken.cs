namespace WebCommons.Db
{
    public static class UserTokenQueryExtensions
    {
        public static IQueryable<UserToken<T>> WhereIsNotExpired<T>(this IQueryable<UserToken<T>> query) where T : CommonUser
        {
            return query.Where(t => !t.ExpirationDate.HasValue || t.ExpirationDate >= DateTimeOffset.UtcNow);
        }
    }
}
