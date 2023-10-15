namespace WebCommons.Controllers
{
    /// <summary>
    /// Placed on action and used to generate a JSON route config.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public class JsonRouteAttribute : Attribute
	{
		public string? Uri { get; set; }
		public int? CacheDuration { get; set; }

		public JsonRouteAttribute(string? uri = null, int cacheDuration = 0)
		{
			this.Uri = uri;
			this.CacheDuration = cacheDuration;
		}
	}
}