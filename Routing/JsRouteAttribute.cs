using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Reflection;

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
        public string View { get; set; }

		/// <summary>
		/// Defines a comma separated list of assets or package names to load with the route.
		/// </summary>
		public string Bundles { get; set; }

		/// <summary>
		/// Defines the URL template for the route.
		/// The <see cref="RouteAttribute"/> has priority, but since it is limited to ASP syntax, you may want to change it with this property.
		/// </summary>
		public string Url { get; set; }

		public JsRouteAttribute(string view = null, string bundles = null, string url = null)
		{
			this.View = view;
			this.Bundles = bundles;
			this.Url = url;
		}

		/// <summary>
		/// Generates JS code to insert into a script that adds routes.
		/// </summary>
		/// <param name="controller">The controllers you wish the generator routes for.</param>
		/// <returns>A list of JS routes ready to be joined toegether as JSON.</returns>
		public static List<string> GenerateJs(Type[] controllers)
		{
			List<string> routeStrings = new();
			foreach (Type controller in controllers) {
				routeStrings.AddRange(GenerateJs(controller));
			}

			return routeStrings;
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
				url = url.Replace(":int", "");

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
				var cacheAttribute = method.GetCustomAttribute<CacheAttribute>();
				if (cacheAttribute != null && string.IsNullOrEmpty(cacheAttribute.Name)) {
					options.Add("cache", new { name = cacheAttribute.Name, duration = cacheAttribute.Duration.Seconds });
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