using Microsoft.AspNetCore.Mvc;
using WebCommons.Dto;

namespace WebCommons.Controllers
{
    public partial class CommonOperationContext
    {
        /// <summary>
        /// Defines the date at which the operation was executed.
        /// </summary>
        public DateTimeOffset Date { get; set; } = DateTimeOffset.UtcNow;

        /// <summary>
        /// Defines an operation as being a test or a simulation that shouldn't permanently impact data.
        /// </summary>
        public bool DryRun { get; set; } = false;

        /// <summary>
        /// Defines the language at which the operation is ran in.
        /// </summary>
        public string Locale { get; set; } = "en";

        /// <summary>
        /// Defines the controller managing the request.
        /// </summary>
        public Controller? Controller { get; set; }

        public CommonOperationContext() { }
    }
}