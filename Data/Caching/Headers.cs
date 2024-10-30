using Microsoft.AspNetCore.Http;

namespace Microsoft.Net.Http.Headers
{
    public static class CacheExtensions
    {
        /// <summary>
        /// Sets the <see href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control">caching headers</see> on the response.
        /// </summary>
        public static void SetCache(this IHeaderDictionary headers, TimeSpan duration)
        {
            string key = HeaderNames.CacheControl;
            string value = "private,max-age=" + duration.TotalSeconds + ",must-revalidate";
            if (headers.ContainsKey(key)) headers[key] = value;
            else headers.Add(key, value);
        }
    }
}
