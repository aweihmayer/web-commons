﻿using MartialMap.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;
using System.Reflection;

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
    public abstract class CommonController<TOperation> : Controller
        where TOperation : OperationContext, new()
    {
        protected TOperation OperationContext { get; set; } = new TOperation();

        #region Life cycle events
        
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            this.OperationContext.Controller = this;

            // Set default utility values
            ViewBag.AbsolutePath = this.Request.Path.Value;
            ViewBag.Domain = this.Request.Host.Value;
            ViewBag.OperationContext = this.OperationContext;
            ViewBag.Response = this.Response;

            if (context.ActionDescriptor is ControllerActionDescriptor controllerActionDescriptor) {
                this.AuthorizeRequest(context, controllerActionDescriptor.MethodInfo);
            }
        }

        protected virtual void AuthorizeRequest(ActionExecutingContext context, MethodInfo method)
        {
            try {
                var permissionAttributes = method.GetCustomAttribute<RequiresAuthAttribute>();
                if (permissionAttributes != null) this.OperationContext.MustBeAuthenticated();
            } catch (ResponseException ex) {
                context.Result = this.IsApiController() ? this.Response.AsJson(ex) : this.View(ex);
            } catch (Exception ex) {
                context.Result = this.IsApiController() ? this.Response.AsJson(ex) : this.View(ex);
            }
        }
        
        #endregion

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