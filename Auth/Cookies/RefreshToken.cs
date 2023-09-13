using WebCommons.Web;

namespace WebCommons.Auth
{
    public class RefreshTokenCookie : Cookie<Guid?>
    {
        public static readonly TimeSpan DURATION = TimeSpan.FromDays(7);

        public RefreshTokenCookie() : base("refresh_token", DURATION) {
            this.HttpOnly = true;
        }
    }
}