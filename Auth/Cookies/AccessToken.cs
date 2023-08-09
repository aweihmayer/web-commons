using WebCommons.Web;

namespace WebCommons.Auth
{
    public class AccessTokenCookie : Cookie<Guid>
    {
        public AccessTokenCookie() : base("access_token", TimeSpan.FromDays(7)) { }
    }
}