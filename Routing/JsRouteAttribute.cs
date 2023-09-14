using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using System.Runtime.CompilerServices;
using WebCommons.IO;
using WebCommons.Model;

namespace WebCommons.Controllers
{
    /// <summary>
    /// Placed on action and used to generate JS routing.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public class JsRouteAttribute : Attribute
	{
        private JsRoute Route { get; set; }

		public JsRouteAttribute(string? view = null, string? bundles = null, string? uri = null, string? cacheName = null, int cacheDuration = 0)
		{
			this.Route = new JsRoute(view, bundles, uri, cacheName, cacheDuration);
		}

        /// <summary>
        /// Gets get JS routes of many controllers.
        /// </summary>
        public static List<JsRoute> GetRoutes(IEnumerable<Type> controllers)
		{
            List<JsRoute> routes = new();
            foreach (Type controller in controllers) {
                routes.AddRange(GetRoutes(controller));
            }

			return routes;
        }

		/// <summary>
		/// Gets get JS routes of a controller.
		/// </summary>
		public static List<JsRoute> GetRoutes(Type controller)
		{
			List<JsRoute> routes = new();
			MethodInfo[] methods = controller.GetMethods();

			bool isApiController = controller.HasCustomAttribute<ApiControllerAttribute>();

			// For each method in the controller
			foreach (MethodInfo method in methods) {
				// Skip if the method doesn't have the necessary attributes
				var jsRouteAttr = method.GetCustomAttribute<JsRouteAttribute>();
				if (jsRouteAttr == null) { continue; }
				var routeAttr = method.GetCustomAttribute<RouteAttribute>();
				if (routeAttr == null) { continue; }

				// URI
				if (string.IsNullOrEmpty(jsRouteAttr.Route.Uri)) {
					jsRouteAttr.Route.Uri = routeAttr.Template;
				}

				// Method
				if (method.GetCustomAttribute<HttpDeleteAttribute>() != null) {		jsRouteAttr.Route.Method = "DELETE"; }
				else if (method.GetCustomAttribute<HttpPatchAttribute>() != null) {	jsRouteAttr.Route.Method = "PATCH"; }
				else if (method.GetCustomAttribute<HttpPostAttribute>() != null) {	jsRouteAttr.Route.Method = "POST"; }
				else if (method.GetCustomAttribute<HttpPutAttribute>() != null) {	jsRouteAttr.Route.Method = "PUT"; }
				else if (method.GetCustomAttribute<HttpGetAttribute>() != null){	jsRouteAttr.Route.Method = "GET"; }

				if (isApiController) {
                    jsRouteAttr.Route.Accept = FileTypeMap.JSON_CONTENT_TYPE;
					jsRouteAttr.Route.ContentType = FileTypeMap.JSON_CONTENT_TYPE;
				}

				// Query string
				foreach (ParameterInfo paramInfo in method.GetParameters()) {
					if (paramInfo.GetCustomAttribute<FromQueryAttribute>() != null) {
						jsRouteAttr.Route.QueryStringParams.AddRange(paramInfo.ParameterType.GetSchema().Select(s => s.Value));
					} else {
						foreach (PropertyInfo property in paramInfo.ParameterType.GetProperties()) {
							if (property.GetCustomAttribute<FromQueryAttribute>() != null) {
                                jsRouteAttr.Route.QueryStringParams.Add(property.GetSchema());
                            }
                        }
					}
				}

                jsRouteAttr.Route.QueryStringParams = jsRouteAttr.Route.QueryStringParams.Where(p => p != null).ToList();
                routes.Add(jsRouteAttr.Route);
			}

			return routes;
		}
	}
}