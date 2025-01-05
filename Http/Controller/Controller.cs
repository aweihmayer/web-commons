using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace WebCommons.Http
{
    /// <summary>
    /// Defines controllers which are the main entry point for requests. They can:
    /// <list type="bullet">
    ///     <item>Contain many actions. Actions are the specific entry for a request and defined as a method in the controller class.</item>
    ///     <item>Manage permissions.</item>
    ///     <item>Return responses.</item>
    ///     <item>Handle exceptions.</item>
    ///     <item>Delegate to other objects (mainly business objects).</item>
    ///     <item>Create cookies.</item>
    /// </list>
    /// </summary>
    public abstract class CommonController : Controller
    {
        #region View response

        protected ViewResult View(Exception ex)
        {
            return this.View(500);
        }

        protected ViewResult View(ResponseException ex)
        {
            return this.View(ex.StatusCode);
        }

        protected ViewResult View(HttpStatusCode code)
        {
            return this.View((int) code);
        }

        protected ViewResult View(int code)
        {
            this.Response.StatusCode = code;
            return this.View();
        }

        #endregion
    }
}