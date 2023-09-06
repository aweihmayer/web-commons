﻿using Microsoft.AspNetCore.Http;
using System.Reflection;

namespace WebCommons.Web
{
    public static class CookieExtensions
    {
        /// <summary>
        /// Adds a cookie to the response.
        /// </summary>
        public static void Create(this IResponseCookies cookies, object cookie)
        {
            Type type = cookie.GetType();
            var value = type.GetPropertyValue<string>(cookie, "Base64Value");
            if (string.IsNullOrEmpty(value)) { return; }
            CookieOptions options = new();

            var name = type.GetPropertyValue<string>(cookie, "Name");
            var duration = type.GetPropertyValue<TimeSpan>(cookie, "Duration");
            options.Expires = DateTime.UtcNow.Add(duration);
            cookies.Append(name, value, options);
        }

        /// <summary>
        /// Deletes a cookie from the response.
        /// </summary>
        public static void Delete(this IResponseCookies cookies, object cookie)
        {
            var name = cookie.GetType().GetPropertyValue<string>(cookie, "Name");
            cookies.Delete(name);
        }

        /// <summary>
        /// Reads a cookie from the request.
        /// </summary>
        public static T Read<T>(this IRequestCookieCollection cookies) where T : new()
        {
            T cookie = new T();
            Type type = typeof(T);
            var name = type.GetPropertyValue<string>(cookie, "Name");
            if (cookies[name] == null) { return cookie; }
            string? value = cookies[name];
            if (string.IsNullOrEmpty(value)) { return cookie; }
            type.SetPropertyValue(cookie, "Base64Value", value);
            return cookie;
        }
    }
}