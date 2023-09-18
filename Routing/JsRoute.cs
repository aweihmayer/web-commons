using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Newtonsoft.Json;
using System.Reflection;
using WebCommons.IO;
using WebCommons.Model;
using WebCommons.Utils;

namespace WebCommons.Controllers
{
    public class JsRoute
    {
        /// <summary>
        /// Defines the front-end view.
        /// The value will be parsed in a function returns <c>() => view</c>.
        /// </summary>
        [JsonProperty("name")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Defines the URI template for the route.
        /// The <see cref="RouteAttribute"/> has priority, but since it is limited to ASP syntax, you may want to change it with this property.
        /// </summary>
        [JsonProperty("uri")]
        public string Uri { get; set; }

        /// <summary>
        /// Defines the HTTP method of the route.
        /// </summary>
        [JsonProperty("method")]
        public string Method { get; set; }

        /// <summary>
        /// Defines the acceptable HTTP <see cref="FileType.GetContentType">content type</see> of the response.
        /// </summary>
        [JsonProperty("accept")]
        public string Accept { get; set; }

        /// <summary>
        /// Defines the HTTP <see cref="FileType.GetContentType">content type</see> of the request.
        /// </summary>
        [JsonProperty("contentType")]
        public string ContentType { get; set; }

        /// <summary>
        /// Defines the front-end view.
		/// The value will be parsed in a function returns <c>() => view</c>.
        /// </summary>
        [JsonProperty("view", NullValueHandling = NullValueHandling.Ignore)]
        [JsonConverter(typeof(JsonNoQuotesConverter))]
        public string? View {
            get { return string.IsNullOrEmpty(this.view) ? null :string.Format("() => <{0} ref=\"view\" />", this.view); }
            set { this.view = value; }
        }

        private string? view = null;

        /// <summary>
        /// Defines a comma separated list of assets or package names to load with the route.
        /// </summary>
        [JsonProperty("bundles")]
        public List<string> Bundles { get; set; } = new List<string>();

        /// <summary>
        /// Defines how the cache is handled.
        /// </summary>
        [JsonProperty("cache")]
        public JsRouteCache Cache { get; set; }

        /// <summary>
        /// Defines the allowed parameters in the query string.
        /// </summary>
        [JsonProperty("queryStringParams")]
        public List<ValueSchema> QueryStringParams { get; set; } = new();

        public JsRoute(JsRouteAttribute jsAttribute, RouteAttribute routeAttribute, MethodInfo method, bool isApiController)
        {
            this.Name = routeAttribute.Name;
            this.View = jsAttribute.View;
            this.Uri = string.IsNullOrEmpty(jsAttribute.Uri) ? routeAttribute.Template : jsAttribute.Uri;

            // Method
			if (method.GetCustomAttribute<HttpDeleteAttribute>() != null) {		this.Method = "DELETE"; }
			else if (method.GetCustomAttribute<HttpPatchAttribute>() != null) {	this.Method = "PATCH"; }
			else if (method.GetCustomAttribute<HttpPostAttribute>() != null) {	this.Method = "POST"; }
			else if (method.GetCustomAttribute<HttpPutAttribute>() != null) {	this.Method = "PUT"; }
			else if (method.GetCustomAttribute<HttpGetAttribute>() != null){	this.Method = "GET"; }

            // Query string
			foreach (ParameterInfo paramInfo in method.GetParameters()) {
				if (paramInfo.GetCustomAttribute<FromQueryAttribute>() != null) {
					this.QueryStringParams.AddRange(paramInfo.ParameterType.BuildSchema().Select(s => s.Value));
				} else {
					foreach (PropertyInfo property in paramInfo.ParameterType.GetProperties()) {
						if (property.GetCustomAttribute<FromQueryAttribute>() != null) {
                            this.QueryStringParams.Add(property.BuildSchema());
                        }
                    }
				}
			}

            this.QueryStringParams = this.QueryStringParams.Where(p => p != null).ToList();

            if (isApiController) {
                this.Accept = FileType.JSON_CONTENT_TYPE;
				this.ContentType = FileType.JSON_CONTENT_TYPE;
			}

            if (jsAttribute.Bundles != null) {
                this.Bundles = jsAttribute.Bundles.Split(',').Select(b => b.Trim()).ToList();
            }

            if (jsAttribute.CacheName != null) {
                this.Cache = new JsRouteCache(jsAttribute.CacheName, jsAttribute.CacheDuration);
            }
        }

        public class JsRouteCache
        {
            /// <summary>
            /// The name of the cache when fetching with the <see href="https://developer.mozilla.org/en-US/docs/Web/API/Cache">JS cache service worker</see>.
            /// </summary>
            [JsonProperty("name")]
            public string? Name { get; set; }

            /// <summary>
            /// The duration in seconds of the cache.
            /// </summary>
            [JsonProperty("duration")]
            public int? Duration { get; set; }

            public JsRouteCache(string? name, int? duration)
            {
                this.Name = name;
                this.Duration = duration;
            }
        }

        /// <summary>
        /// Build the JS routes of many controllers.
        /// </summary>
        public static List<JsRoute> BuildRoutes(IEnumerable<Type> controllers)
		{
            List<JsRoute> routes = new();
            foreach (Type controller in controllers) {
                routes.AddRange(BuildRoutes(controller));
            }

			return routes;
        }

		/// <summary>
		/// Builds the JS routes of a controller.
		/// </summary>
		public static List<JsRoute> BuildRoutes(Type controller)
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

				JsRoute route = new(jsRouteAttr, routeAttr, method, isApiController);
                routes.Add(route);
			}

			return routes;
		}
    }
}
