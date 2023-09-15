using Microsoft.AspNetCore.Mvc;
using System.Reflection;
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
		public string? View { get; set; }
		public string? Bundles { get; set; }
		public string? Uri { get; set; }
		public string? CacheName { get; set; }
		public int? CacheDuration { get; set; }

		public JsRouteAttribute(string? view = null, string? bundles = null, string? uri = null, string? cacheName = null, int cacheDuration = 0)
		{
			this.View = view;
			this.Bundles = bundles;
			this.Uri = uri;
			this.CacheName = cacheName;
			this.CacheDuration = cacheDuration;
		}
	}
}