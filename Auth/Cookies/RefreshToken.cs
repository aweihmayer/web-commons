using Newtonsoft.Json;
using WebCommons.Web;

namespace WebCommons.Auth
{
    public class RefreshTokenCookie : Cookie<Guid?>
    {
        public RefreshTokenCookie() : base("refresh_token", TimeSpan.FromDays(7)) { }
    }
}