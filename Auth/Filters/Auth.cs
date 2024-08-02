using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using WebCommons.Db;
using WebCommons.Http;

namespace WebCommons.Auth.Filters
{
    public interface IAuthFilter<TUser> : IActionFilter where TUser : CommonUser
    {
        public CommonAuthService<TUser> CreateService(Controller controller);
    }

    public abstract class CommonAuthFilter<TUser> : IAuthFilter<TUser> where TUser : CommonUser
    {
        public abstract CommonAuthService<TUser> CreateService(Controller controller);

        public void OnActionExecuted(ActionExecutedContext context) { }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var controller = context.Controller as Controller;
            if (controller == null) return;
            CommonAuthService<TUser> service = this.CreateService(controller);
            TUser user;

            // Authentication with header
            string? authHeader = controller.Request.Headers.Authorization;
            if (!string.IsNullOrEmpty(authHeader)) {
                // Splits the header to separate the value from the type. For example 'Basic <TOKEN>'
                string[] values = authHeader.Trim().Split(' ');

                // Two elements, the header has a type and a value
                if (values.Length == 2) {
                    switch (values[0]) {
                        // Basic type has credentials separated by a colon as email:password encoded in base64
                        case "Basic":
                            string[] credentials = values[1].DecodeBase64().Split(':');
                            if (credentials.Length != 2) return;
                            user = service.FindUser(credentials[0], credentials[1]);
                            context.HttpContext.SetUser(user);
                            return;
                        // Bearer type has GUID token
                        case "Bearer":
                            Guid token;
                            if (!Guid.TryParse(values[1], out token)) return;
                            user = service.FindUserByAccessToken(token);
                            context.HttpContext.SetUser(user);
                            return;
                        default:
                            return;
                    }
                // One element, the header only has a token value
                } else if (values.Length == 1) {
                    if (!Guid.TryParse(values[0], out Guid token)) return;
                    user = service.FindUserByAccessToken(token);
                    context.HttpContext.SetUser(user);
                    return;
                } else {
                    return;
                }
            }
            // Authentication with cookie
            else {
                var accessTokenCookie = controller.Request.Cookies.Read<AccessTokenCookie>();
                if (accessTokenCookie == null || accessTokenCookie.IsEmpty()) return;
                user = service.FindUserByAccessToken(accessTokenCookie.Value);
                context.HttpContext.SetUser(user);
            }
        }
    }
}
