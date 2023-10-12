using Microsoft.AspNetCore.Mvc;
using WebCommons.Db;
using WebCommons.Internationalization;

namespace WebCommons.Controllers
{
    public interface OperationContext
    {
        public Controller? Controller { get; set; }
        bool MustBeAuthenticated();
    }

    public partial class CommonOperationContext<TDb, TUser> : OperationContext where TDb : CommonDbContextWithAuth<TUser>, new() where TUser : CommonUser
    {
        public TDb Db { get; set; } = new TDb();
        public DateTimeOffset Date { get; set; } = DateTimeOffset.UtcNow;
        public bool DryRun { get; set; } = false;
        public I18n I18n { get; set; } = new("en");

        public CommonOperationContext() { }
    }
}