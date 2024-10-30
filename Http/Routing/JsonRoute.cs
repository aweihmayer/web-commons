using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Template;
using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using System.Text.RegularExpressions;
using WebCommons.IO;

namespace WebCommons.Controllers
{
    public class JsonRoute
    {
        /// <summary>
        /// Defines the route name which should be a JSON path. On the front-end you can retrieve the route with that path.
        /// </summary>
        [JsonProperty("name")]
        public string Name { get; } = string.Empty;

        /// <summary>
        /// Defines the URI template for the route.
        /// </summary>
        [JsonProperty("template")]
        public string Template { get; }

        /// <summary>
        /// Defines the HTTP method of the route.
        /// </summary>
        [JsonProperty("method")]
        public string Method { get; }

        /// <summary>
        /// Defines the acceptable HTTP <see cref="FileType.GetContentType">content type</see> of the response.
        /// </summary>
        [JsonProperty("accept")]
        public string? Accept { get; } = null;

        /// <summary>
        /// Defines the HTTP <see cref="FileType.GetContentType">content type</see> of the request.
        /// </summary>
        [JsonProperty("contentType")]
        public string? ContentType { get; } = null;

        /// <summary>
        /// Defines cache duration in ms.
        /// </summary>
        [JsonProperty("cacheDuration")]
        public int? CacheDuration { get; }

        /// <summary>
        /// Defines the cache name.
        /// </summary>
        [JsonProperty("cacheName")]
        public string? CacheName { get; }

        public Dictionary<string, string> RouteParams { get; } = new();

        public Dictionary<string, string> QueryParams { get; } = new();

        public JsonRoute(JsonRouteAttribute routeAttribute, MethodInfo method, bool isApiController)
        {
            this.Name = routeAttribute.Name ?? "default";
            this.CacheDuration = (routeAttribute.CacheDuration != 0) ? routeAttribute.CacheDuration : null;
            this.CacheName = routeAttribute.CacheName;

            // Method
			if (method.HasAttribute<HttpDeleteAttribute>()) this.Method = "DELETE";
			else if (method.HasAttribute<HttpPatchAttribute>()) this.Method = "PATCH";
			else if (method.HasAttribute<HttpPostAttribute>()) this.Method = "POST";
			else if (method.HasAttribute<HttpPutAttribute>()) this.Method = "PUT";
			else if (method.HasAttribute<HttpGetAttribute>()) this.Method = "GET";
            else throw new Exception("Route is missing HTTP method");

            if (isApiController) {
                this.Accept = FileType.JSON_CONTENT_TYPE;
				this.ContentType = FileType.JSON_CONTENT_TYPE;
			}

            this.Template = routeAttribute.Template;
            var regex = new Regex(@"\{([^{}]+)\}");
            this.RouteParams = regex.Matches(this.Template).Select(x => x.Groups[1].Value.Split(':').First()).ToArray();
        }

        /// <summary>
        /// Build the JS routes of many controllers.
        /// </summary>
        public static List<JsonRoute> BuildRoutes(IEnumerable<Type> controllers)
		{
            List<JsonRoute> routes = new();
            foreach (Type controller in controllers) routes.AddRange(BuildRoutes(controller));
			return routes;
        }

		/// <summary>
		/// Builds the JS routes of a controller.
		/// </summary>
		public static List<JsonRoute> BuildRoutes(Type controller)
		{
			List<JsonRoute> routes = new();
			bool isApiController = controller.HasAttribute<ApiControllerAttribute>();

			// For each method in the controller
			foreach (MethodInfo method in controller.GetMethods()) {
				// Skip if the method doesn't have the necessary attributes
				var routeAttributes = method.GetCustomAttributes<JsonRouteAttribute>();
                foreach (var route in routeAttributes) routes.Add(new JsonRoute(route, method, isApiController));
			}

			return routes;
		}
    }
}
