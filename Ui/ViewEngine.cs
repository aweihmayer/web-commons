using System.IO;
using System.Web;
using System.Web.Mvc;

namespace WebCommons.Core
{
    /// <summary>
    /// Configures how the application fetches views and renders partial HTML components on the server-side.
    /// </summary>
    public class CustomViewEngine : RazorViewEngine
    {
        public CustomViewEngine()
        {
            this.ViewLocationFormats = new[] { "~/App/UI/Layout/empty.cshtml" } ;
            this.MasterLocationFormats = new[] { "~/App/UI/Layout/empty.cshtml" };
            this.PartialViewLocationFormats = new[] { "~/App/UI/{0}.cshtml" };
        }

        /// <summary>
        /// Renders a partial HTML component.
        /// </summary>
        /// <param name="file">The file path of the component.</param>
        /// <param name="data">The data to pass to the component.</param>
        /// <returns>The rendered component.</returns>
        public static MvcHtmlString RenderPartial(string file, ViewDataDictionary data)
        {
            StringWriter output = new StringWriter();
            ControllerContext context = (ControllerContext)HttpContext.Current.Items["controllerContext"];
            ViewEngineResult viewResult = ViewEngines.Engines.FindPartialView(context, file);
            ViewContext viewContext = new ViewContext(context, viewResult.View, data, new TempDataDictionary(), output);
            viewResult.View.Render(viewContext, output);
            return new MvcHtmlString(output.GetStringBuilder().ToString());
        }
    }
}
