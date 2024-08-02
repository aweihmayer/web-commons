using Microsoft.AspNetCore.Http;

namespace WebCommons.Http
{
    public static class HttpDotNetExtensions
    {
        public static void SetUser(this HttpContext context, object? user)
        {
            if (user == null) return;
            else context.Items["user"] = user;
        }

        public static object? GetUser(this HttpContext context)
        {
            return context.Items["user"];
        }

        public static T? GetUser<T>(this HttpContext context)
        {
            return (T)context.Items["user"];
        }
    }
}
