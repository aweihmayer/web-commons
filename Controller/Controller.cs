using MartialMap.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System.Net;
using WebCommons.Caching;
using WebCommons.Db;

namespace WebCommons.Controllers
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
    public class CommonController<TOperation, TUser> : Controller where TOperation : OperationContext<TUser>, new() where TUser : CommonUser
    {
        private bool AutoRedirect { get; set; } = true;

        protected TOperation OperationContext { get; set; } = new TOperation();

        #region Model

        /// <summary>
        /// Determines if the model is valid. TODO maybe a cleaner way
        /// </summary>
        /// <returns>True if the model is valid.</returns>
        /// <exception cref="ResponseException">Thrown as a bad request (400) if the model is not valid.</exception>
        protected bool ValidateModel()
        {
            if (ModelState.IsValid) { return true; }
            throw new BadRequestException();
        }

        #endregion Model

        #region Error JSON response

        protected ContentResult ErrorJson(Exception ex)
        {
            return this.ErrorJson(500, "");
        }

        protected ContentResult ErrorJson(ResponseException ex)
        {
            return this.ErrorJson(ex.StatusCode, ex.Message);
        }

        protected ContentResult ErrorJson(HttpStatusCode code, object content = null)
        {
            return this.ErrorJson((int) code, content);
        }

        protected ContentResult ErrorJson(HttpStatusCode code, string content = null)
        {
            return this.ErrorJson((int) code, content);
        }

        protected ContentResult ErrorJson(int code = 500, object content = null)
        {
            Response.StatusCode = code;
            this.AutoRedirect = false;
            return ErrorJson(code, JsonConvert.SerializeObject(content));
        }

        // TODO remove this because it is ambiguous and nobody will ever use it like this
        protected ContentResult ErrorJson(int code = 500, string content = null)
        {
            if (string.IsNullOrEmpty(content)) { content = "{}"; }
            Response.StatusCode = code;
            this.AutoRedirect = false;
            return new ContentResult { Content = content, ContentType = "application/json" };
        }

        #endregion

        #region Error view response

        protected ViewResult ErrorView(Exception ex)
        {
            return this.ErrorView(500);
        }

        protected ViewResult ErrorView(ResponseException ex)
        {
            return this.ErrorView(ex.StatusCode);
        }

        protected ViewResult ErrorView(HttpStatusCode code)
        {
            return this.ErrorView((int) code);
        }

        protected ViewResult ErrorView(int code = 500)
        {
            Response.StatusCode = code;
            return View();
        }

        #endregion

        #region Error file response

        protected FileResult ErrorFile()
        {
            Response.StatusCode = 404;
            return default;
        }

        #endregion

        #region Successful JSON response

        protected ContentResult SuccessJson(HttpStatusCode code)
        {
            return this.SuccessJson("{}", (int) code);
        }

        protected ContentResult SuccessJson(int code = 200)
        {
            return this.SuccessJson("{}", code);
        }

        protected ContentResult SuccessJson(object content, HttpStatusCode code)
        {
            return this.SuccessJson(content, (int)code);
        }

        protected ContentResult SuccessJson(object content, int code = 200)
        {
            string serializedContent = JsonConvert.SerializeObject(content);
            return this.SuccessJson(serializedContent, code);
        }

        protected ContentResult SuccessJson(string content, int code = 200)
        {
            Response.StatusCode = code;
            this.AutoRedirect = false;
            return new ContentResult { Content = content, ContentType = "application/json" };
        }

        #endregion

        #region Life cycle events

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // Set default utility values
            ViewBag.AbsolutePath = Request.Path.Value;
            ViewBag.Domain = this.Request.Host.Value;
            ViewBag.OperationContext = this.OperationContext;

            ControllerActionDescriptor controllerActionDescriptor;
            if (context.ActionDescriptor is ControllerActionDescriptor) {
                controllerActionDescriptor = context.ActionDescriptor as ControllerActionDescriptor;
            } else {
                return;
            }


            // Check the user's permissions
            try {
                // Check if the action has the RequiresAuth attribute
                object[] permissionAttributes = controllerActionDescriptor.MethodInfo.GetCustomAttributes(typeof(RequiresAuthAttribute), false);
                if (permissionAttributes.Length == 0) { return; }
                // The action has the attribute, check that the user is authenticated
                RequiresAuthAttribute permissionAttribute = (RequiresAuthAttribute)permissionAttributes[0];
                this.OperationContext.Auth.MustBeAuthenticated();
            } catch (Exception ex) {
                // The user is not authenticated
                object[] jsRouteAttributes = controllerActionDescriptor.MethodInfo.GetCustomAttributes(typeof(JsRouteAttribute), false);
                // The action is an API call, show a JSON error
                if (jsRouteAttributes.Length == 0) { context.Result = this.ErrorJson(ex); }
                // The action is a view, show a HTML error
                else { context.Result = this.ErrorView(ex); }
            }

            // Set cache headers depending on the action's attributes
            object[] cacheAttributes = controllerActionDescriptor.MethodInfo.GetCustomAttributes(typeof(CacheAttribute), false);
            if (cacheAttributes.Length > 0) {
                CacheAttribute cacheAttribute = (CacheAttribute)cacheAttributes[0];
                object[] jsRouteAttributes = controllerActionDescriptor.MethodInfo.GetCustomAttributes(typeof(JsRouteAttribute), false);
                // Set cached headers only if the method does not have a JsRoute attribute
                if (jsRouteAttributes.Length == 0) { Response.SetCache(cacheAttribute.Duration); }
            }
        }

        public override void OnActionExecuted(ActionExecutedContext context) { }

        #endregion
    }
}