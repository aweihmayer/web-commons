﻿using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;

namespace WebCommons.Caching
{
    public static class CacheExtensions
    {
        /// <summary>
        /// Sets the <see href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control">caching headers</see> on the response.
        /// </summary>
        public static void SetCache(this IHeaderDictionary headers, TimeSpan duration)
        {
            if (headers.ContainsKey(HeaderNames.CacheControl)) {
                headers[HeaderNames.CacheControl] = "private,max-age=" + duration.TotalSeconds + ",must-revalidate";
            } else {
                headers.Add(HeaderNames.CacheControl, "private,max-age=" + duration.TotalSeconds + ",must-revalidate");
            }
        }
    }
}
