using WebCommons.Db;
using WebCommons.Internationalization;

namespace WebCommons.Controllers
{
    public partial class OperationContext<TDb, TUser> where TDb : CommonDbContextWithAuth<TUser>, new() where TUser : CommonUser
    {
        public TDb Db { get; set; } = new TDb();
        public DateTime Date { get; set; } = DateTime.UtcNow;
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

        public OperationContext() { }
    }
}