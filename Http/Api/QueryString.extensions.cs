using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using System.Web;

namespace WebCommons.Api
{
    public static class QueryStringExtensions
    {
        /// <summary>
        /// Gets the query string parameters of an object.
        /// </summary>
        public static Dictionary<string, object> GetQueryStringParams(this Dictionary<string, object> obj)
        {
            return obj;
        }

        /// <summary>
        /// Gets the query string parameters of an object.
        /// </summary>
        /// <param name="onlyPropertiesWithQueryAttribute">If true, only properties with the <see cref="FromQueryAttribute" /> will be collected.</param>
        public static Dictionary<string, object> GetQueryStringParams(this object? obj, bool onlyPropertiesWithQueryAttribute = true)
        {
            if (obj == null) { return new Dictionary<string, object>(); }

            Type type = obj.GetType();
            PropertyInfo[] props = type.GetProperties();

            Dictionary<string, object> query = new();

            foreach (PropertyInfo prop in props) {
                if (!prop.PropertyType.IsPrimitive && !prop.PropertyType.IsArray) { continue; }
                string name = prop.Name;

                if (onlyPropertiesWithQueryAttribute) {
                    FromQueryAttribute? queryAttribute = prop.GetCustomAttribute<FromQueryAttribute>();
                    if (queryAttribute == null) { continue; }
                    if (!string.IsNullOrEmpty(queryAttribute.Name)) { name = queryAttribute.Name; }
                }

                object? value = prop.GetValue(obj);
                if (value != null) { query.Add(name, value); }
            }

            return query;
        }

        /// <summary>
        /// Transforms a dictionary into a query string.
        /// </summary>
        public static string ToQueryString(this Dictionary<string, object> parameters)
        {
            List<string> query = new();
            foreach (KeyValuePair<string, object> param in parameters) {
                query.Add(param.Key.FirstCharToLower() + "=" + HttpUtility.UrlEncode(param.Value.ToString()));
            }

            return (query.Count == 0) ? "" : "?" + String.Join("&", query.ToArray());
        }

        /// <summary>
        /// Transforms an object into a query string.
        /// </summary>
        /// <param name="onlyPropertiesWithQueryAttribute">If true, only properties will the query string attribute will be transformed.</param>
        public static string ToQueryString(this object obj, bool onlyPropertiesWithQueryAttribute = true)
        {
            return obj.GetQueryStringParams(onlyPropertiesWithQueryAttribute).ToQueryString();
        }
    }
}
