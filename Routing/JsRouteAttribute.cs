using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Reflection;
using WebCommons.Model;

namespace WebCommons.Controllers
{
    /// <summary>
    /// Placed on action and used to generate JS routing.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public class JsRouteAttribute : Attribute
	{
        /// <summary>
        /// Defines the front-end view.
		/// The value will be parsed in a function returns <c>() => view</c>.
        /// </summary>
        public string? View { get; set; }

		/// <summary>
		/// Defines a comma separated list of assets or package names to load with the route.
		/// </summary>
		public string? Bundles { get; set; }

		/// <summary>
		/// Defines the URL template for the route.
		/// The <see cref="RouteAttribute"/> has priority, but since it is limited to ASP syntax, you may want to change it with this property.
		/// </summary>
		public string? Url { get; set; }

		/// <summary>
		/// The name of the cache when fetching with the <see href="https://developer.mozilla.org/en-US/docs/Web/API/Cache">JS cache service worker</see>.
		/// </summary>
		public string? CacheName { get; set; }

		/// <summary>
		/// The duration in seconds of the cache.
		/// </summary>
		public int CacheDuration { get; set; }

		public JsRouteAttribute(string? view = null, string? bundles = null, string? url = null, string? cacheName = null, int cacheDuration = 0)
		{
			this.View = view;
			this.Bundles = bundles;
			this.Url = url;
			this.CacheName = cacheName;
			this.CacheDuration = cacheDuration;
		}

		/// <summary>
		/// Generates JS code to insert into a script that adds routes.
		/// </summary>
		/// <param name="controller">The controllers you wish the generator routes for.</param>
		/// <returns>A list of JS routes ready to be joined toegether as JSON.</returns>
		public static string GenerateJs(Type[] controllers)
		{
			List<string> routeStrings = new();
			foreach (Type controller in controllers) {
				routeStrings.AddRange(GenerateJs(controller));
			}

			return string.Join(", ", routeStrings);
		}

		/// <summary>
		/// Generates JS code to insert into a script that adds routes.
		/// </summary>
		/// <param name="controller">The controller you wish the generator routes for.</param>
		/// <returns>A list of JS routes ready to be joined toegether as JSON.</returns>
		public static List<string> GenerateJs(Type controller)
		{
			List<string> routeStrings = new();
			MethodInfo[] methods = controller.GetMethods();

			// For each method in the controller
			foreach (MethodInfo method in methods) {
				// Skip if the method doesn't have the necessary attributes
				var jsRouteAttr = method.GetCustomAttribute<JsRouteAttribute>();
				if (jsRouteAttr == null) { continue; }
				var routeAttr = method.GetCustomAttribute<RouteAttribute>();
				if (routeAttr == null) { continue; }

				// Url
				string url = string.IsNullOrEmpty(jsRouteAttr.Url) ? routeAttr.Template : jsRouteAttr.Url;
				url = url.Replace(":int", ""); // TODO keep type

				// View or HTTP method
				string viewOrHttpMethod = "";
				if (!string.IsNullOrEmpty(jsRouteAttr.View)) {
					viewOrHttpMethod = "() => " + jsRouteAttr.View.Replace(" />", " ref=\"view\" />");
				}
				else if (method.GetCustomAttribute<HttpDeleteAttribute>() != null) {	viewOrHttpMethod = "'DELETE'"; }
				else if (method.GetCustomAttribute<HttpPatchAttribute>() != null) {		viewOrHttpMethod = "'PATCH'"; }
				else if (method.GetCustomAttribute<HttpPostAttribute>() != null) {		viewOrHttpMethod = "'POST'"; }
				else if (method.GetCustomAttribute<HttpPutAttribute>() != null) {		viewOrHttpMethod = "'PUT'"; }
				else if (method.GetCustomAttribute<HttpGetAttribute>() != null){		viewOrHttpMethod = "'GET'"; }

				// Options
				Dictionary<string, object> options = new();
				// Bundles
				if (!string.IsNullOrEmpty(jsRouteAttr.Bundles)) {
					options.Add("bundles", jsRouteAttr.Bundles.Split(','));
				}

				// Caching
				if (string.IsNullOrEmpty(jsRouteAttr.CacheName)) {
					int? cacheDuration = (jsRouteAttr.CacheDuration == 0) ? null : jsRouteAttr.CacheDuration;
					options.Add("cache", new {
						name = jsRouteAttr.CacheName,
						duration = cacheDuration });
				}

				foreach (ParameterInfo paramInfo in method.GetParameters()) {
					if (paramInfo.GetCustomAttribute<FromQueryAttribute>() != null) {
						options.Add("queryStringSchema", paramInfo.ParameterType.GetSchema());
					} else {
						// for each prop
					}
				}

				// Format the route string
				routeStrings.Add(String.Format("'{0}': new Route('{1}', {2}, {3})",
					routeAttr.Name,
					url,
					viewOrHttpMethod,
					JsonConvert.SerializeObject(options)));
			}

			return routeStrings;
		}
	}
}