using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Reflection;
using WebCommons.Db;
using WebCommons.Http;

namespace WebCommons.Auth.Filters
{
    public class AuthFilter<TDb, TUser> : IActionFilter where TDb : CommonDbContextWithAuth<TUser>, new() where TUser : CommonUser
    {
        public void OnActionExecuted(ActionExecutedContext context) { }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var controller = context.Controller as Controller;
            if (controller == null) return;
            AuthService<TDb, TUser> service = new(controller);
            TUser? user;

            string? authHeader = controller.Request.Headers.Authorization;
            if (!string.IsNullOrEmpty(authHeader)) user = this.AuthenticateWithHeader(context, authHeader, service);
            else user = this.AuthenticateWithCookie(context, controller, service);

            this.Authorize(context, controller, user);
        }

        protected TUser? AuthenticateWithHeader(ActionExecutingContext context, string header, AuthService<TDb, TUser> service)
        {
            TUser? user;
            // Splits the header to separate the value from the type. For example 'Basic <TOKEN>'
            string[] values = header.Trim().Split(' ');

            // Two elements, the header has a type and a value
            if (values.Length == 2) {
                switch (values[0]) {
                    // Basic type has credentials separated by a colon as email:password encoded in base64
                    case "Basic":
                        string[] credentials = values[1].DecodeBase64().Split(':');
                        if (credentials.Length != 2) return null;
                        user = service.FindUser(credentials[0], credentials[1]);
                        if (user != null) context.HttpContext.SetUser(user);
                        return user;
                    // Bearer type has GUID token
                    case "Bearer":
                        Guid token;
                        if (!Guid.TryParse(values[1], out token)) return null;
                        user = service.FindUserByAccessToken(token);
                        if (user != null) context.HttpContext.SetUser(user);
                        return user;
                    default:
                        return null;
                }
            // One element, the header only has a token value
            } else if (values.Length == 1) {
                if (!Guid.TryParse(values[0], out Guid token)) return null;
                user = service.FindUserByAccessToken(token);
                if (user != null) context.HttpContext.SetUser(user);
                return user;
            } else {
                return null;
            }
        }

        protected TUser? AuthenticateWithCookie(ActionExecutingContext context, Controller controller, AuthService<TDb, TUser> service)
        {
            var accessTokenCookie = controller.Request.Cookies.Read<AccessTokenCookie>();
            if (accessTokenCookie == null || accessTokenCookie.IsEmpty()) return null;
            TUser? user = service.FindUserByAccessToken(accessTokenCookie.Value);
            if (user != null) context.HttpContext.SetUser(user);
            return user;
        }

        protected void Authorize(ActionExecutingContext context, Controller controller, TUser? user)
        {
            if (context.ActionDescriptor is not ControllerActionDescriptor controllerActionDescriptor) return;
            try {
                var method = controllerActionDescriptor.MethodInfo;
                if (method == null) return;
                var attribute = method.GetCustomAttribute<PermitAttribute>();
                if (attribute == null) return;
                else if (user == null) throw new UnauthorizedException();
                else if (this.ValidatePermissions(context, attribute.Permissions, user)) return;
                else throw new ForbiddenException();
            } catch (ResponseException ex) {
                context.Result = controller.IsApiController() ? controller.Response.AsJson(ex) : controller.View(ex);
            } catch (Exception ex) {
                context.Result = controller.IsApiController() ? controller.Response.AsJson(ex) : controller.View(ex);
            }
        }

        public virtual bool ValidatePermissions(ActionExecutingContext context, string[] allowedPermissions, TUser user) => true;
    }
}
