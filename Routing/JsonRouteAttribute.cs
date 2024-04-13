using Microsoft.AspNetCore.Mvc;

namespace WebCommons.Controllers
{
    /// <summary>
    /// Placed on action and used to generate a JSON route config.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
    public class JsonRouteAttribute : RouteAttribute
	{
		public string? JsonTemplate { get; set; } = null;
        public string? CacheName { get; set; } = null;
        public int CacheDuration { get; set; }

		public JsonRouteAttribute(string template, string? jsonTemplate = null, int cacheDuration = 0, string cacheName = null) : base(template)
		{
			this.JsonTemplate = jsonTemplate;
			this.CacheName = cacheName;
			this.CacheDuration = cacheDuration;
		}
	}
}