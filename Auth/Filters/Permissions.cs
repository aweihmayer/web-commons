using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using WebCommons.Controllers;
using WebCommons.Http;
using System.Reflection;

namespace WebCommons.Auth.Filters
{
    public interface IPermissionsFilter : IActionFilter
    {
        public bool ValidatePermissions(ActionExecutingContext context,string[] allowedPermissions);
    }

    public abstract class CommonPermissionsFilter : IPermissionsFilter
    {   
        public void OnActionExecuted(ActionExecutedContext context) { }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var controller = context.Controller as Controller;
            if (controller == null) return;

            if (context.ActionDescriptor is ControllerActionDescriptor controllerActionDescriptor) {
                try {
                    var method = controllerActionDescriptor.MethodInfo;
                    if (method == null) return;
                    var attribute = method.GetCustomAttribute<PermitAttribute>();
                    if (attribute == null) return;
                    if (context.HttpContext.GetUser() == null) throw new UnauthorizedException();
                    if (this.ValidatePermissions(context, attribute.Permissions)) return;
                    else throw new ForbiddenException();
                } catch (ResponseException ex) {
                    context.Result = controller.IsApiController() ? controller.Response.AsJson(ex) : controller.View(ex);
                } catch (Exception ex) {
                    context.Result = controller.IsApiController() ? controller.Response.AsJson(ex) : controller.View(ex);
                }
            }
        }

        // TODO pass user
        public abstract bool ValidatePermissions(ActionExecutingContext context, string[] allowedPermissions);
    }
}
