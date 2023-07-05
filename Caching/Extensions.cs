using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;

namespace WebCommons.Caching
{
    public static class CacheExtensions
    {
        /// <summary>
        /// Sets the <see href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control">caching headers</see> on the response.
        /// </summary>
        public static void SetCache(this HttpResponse response, TimeSpan duration)
        {
            response.Headers.SetCache(duration);
        }

        /// <summary>
        /// Sets the <see href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control">caching headers</see> on the response.
        /// </summary>
        public static void SetCache(this IHeaderDictionary headers, TimeSpan duration)
        {
            headers.Add(HeaderNames.CacheControl, "private,max-age=" + duration.Seconds + ",must-revalidate");
        }
    }
}
