using WebCommons.Data.Web;
using Newtonsoft.Json;

namespace WebCommons.Auth
{
    public class AuthCookie : Cookie
    {
        [JsonProperty("token")]
        public Guid? Token { get; set; }

        public AuthCookie() : base("auth", TimeSpan.FromDays(7)) { }

        public void Create(Guid token)
        {
            this.Token = token;
            this.Create();
        }

        public bool IsValid()
        {
            return this.Token.HasValue;
        }
    }
}