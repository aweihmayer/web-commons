using Microsoft.AspNetCore.Http;
using WebCommons.Auth;
using WebCommons.Db;
using WebCommons.Internationalization;

namespace WebCommons.Controllers
{
    public class OperationContext<TUser> where TUser : CommonUser
    {
        public I18n I18n { get; set; } = new("en");

        private string locale = "en";
        public string Locale {
            get {
                return this.locale;
            }
            set {
                this.locale = value;
                this.I18n.Locale = value;
            }
        }

        public DateTime Date { get; set; } = DateTime.UtcNow;
        public AuthContext<TUser> Auth { get; set; } = new AuthContext<TUser>();

        public void Init(HttpRequest request, HttpResponse response)
        {
            this.Auth.Init(request, response);
        }
    }
}