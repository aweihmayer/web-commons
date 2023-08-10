using WebCommons.Web;

namespace WebCommons.Auth
{
    public class AccessTokenCookie : Cookie<Guid?>
    {
        public static readonly TimeSpan DURATION = TimeSpan.FromMinutes(30);

        public AccessTokenCookie() : base("access_token", DURATION) { }
    }
}