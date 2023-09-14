﻿using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebCommons.Model;
using WebCommons.IO;
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
        /// Defines the acceptable HTTP <see cref="FileTypeMap.GetContentType">content type</see> of the response.
        /// </summary>
        [JsonProperty("accept")]
        public string Accept { get; set; }

        /// <summary>
        /// Defines the HTTP <see cref="FileTypeMap.GetContentType">content type</see> of the request.
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
            get { return string.Format("() => <{0} ref=\"view\" >", this.view); }
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

        public JsRoute(string? view = null, string? bundles = null, string? uri = null, string? cacheName = null, int cacheDuration = 0)
        {
            this.View = view;
            this.Uri = uri;

            if (bundles != null) {
                this.Bundles = bundles.Split(',').Select(b => b.Trim()).ToList();
            }

            if (cacheName != null) {
                this.Cache = new JsRouteCache(cacheName, cacheDuration);
            }
        }

        public class JsRouteCache
        {
            /// <summary>
            /// The name of the cache when fetching with the <see href="https://developer.mozilla.org/en-US/docs/Web/API/Cache">JS cache service worker</see>.
            /// </summary>
            [JsonProperty("type")]
            public string Name { get; set; }

            /// <summary>
            /// The duration in seconds of the cache.
            /// </summary>
            [JsonProperty("type")]
            public int Duration { get; set; }

            public JsRouteCache(string name, int duration)
            {
                this.Name = name;
                this.Duration = duration;
            }
        }
    }
}
