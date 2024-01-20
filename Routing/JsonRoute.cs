using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Reflection;
using WebCommons.IO;
using WebCommons.Model;

namespace WebCommons.Controllers
{
    public class JsonRoute
    {
        /// <summary>
        /// Defines the route name which should be a JSON path.
        /// </summary>
        [JsonProperty("name")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Defines the URI template for the route.
        /// The <see cref="RouteAttribute"/> has priority, but since its syntax is not customizable syntax, you may want to change it with this property.
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
        /// Defines cache duration in ms.
        /// </summary>
        [JsonProperty("cacheDuration")]
        public int? CacheDuration { get; set; }

        /// <summary>
        /// Defines the allowed parameters in the query string.
        /// </summary>
        [JsonProperty("queryStringParams")]
        public List<ValueSchema> QueryStringParams { get; set; } = new();

        public JsonRoute(JsonRouteAttribute routeAttribute, MethodInfo method, bool isApiController)
        {
            this.Name = routeAttribute.Name;
            this.Uri = string.IsNullOrEmpty(routeAttribute.JsonTemplate) ? routeAttribute.Template : routeAttribute.JsonTemplate;
            this.CacheDuration = (routeAttribute.CacheDuration != 0) ? routeAttribute.CacheDuration : null;

            // Method
			if (method.GetCustomAttribute<HttpDeleteAttribute>() != null) this.Method = "DELETE";
			else if (method.GetCustomAttribute<HttpPatchAttribute>() != null) this.Method = "PATCH";
			else if (method.GetCustomAttribute<HttpPostAttribute>() != null) this.Method = "POST";
			else if (method.GetCustomAttribute<HttpPutAttribute>() != null)	this.Method = "PUT";
			else if (method.GetCustomAttribute<HttpGetAttribute>() != null)	this.Method = "GET";

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
			MethodInfo[] methods = controller.GetMethods();
			bool isApiController = controller.HasCustomAttribute<ApiControllerAttribute>();

			// For each method in the controller
			foreach (MethodInfo method in methods) {
				// Skip if the method doesn't have the necessary attributes
				var routeAttributes = method.GetCustomAttributes<JsonRouteAttribute>();
                foreach (var route in routeAttributes) routes.Add(new JsonRoute(route, method, isApiController));
			}

			return routes;
		}
    }
}
