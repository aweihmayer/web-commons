using WebCommons.Db;
using WebCommons.Web;

namespace WebCommons.Auth
{
    public class AccessTokenCookie : Cookie<Guid>
    {
        public AccessTokenCookie() : base("access_token", UserTokenDurations.Access) { }
    }
}