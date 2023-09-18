using WebCommons.Db;
using WebCommons.Web;

namespace WebCommons.Auth
{
    public class RefreshTokenCookie : Cookie<Guid?>
    {
        public static string DefaultPath { get; set; } = "/api/auth/refresh";

        public RefreshTokenCookie() : base("refresh_token", UserTokenDurations.Refresh) {
            this.HttpOnly = true;
            this.Path = RefreshTokenCookie.DefaultPath;
        }
    }
}