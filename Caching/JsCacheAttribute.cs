namespace WebCommons.Controllers
{
    /// <summary>
    /// Placed on an action to add caching.
    /// If the action has a <see cref="JsRouteAttribute"/>, we use <see href="https://developer.mozilla.org/en-US/docs/Web/API/Cache">JS cache service worker</see>.
    /// Other we use <see href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control">caching headers</see>.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public class JsCacheAttribute : Attribute
	{
		public TimeSpan Duration { get; set; }
		public string? Name { get; set; }

        /// <param name="Duration">Duration in seconds of the cache.</param>
        public JsCacheAttribute(int Duration = 0, string? name = null)
        {
            this.Duration = new TimeSpan(0, 0, 0, Duration);
            this.Name = name;
        }
    }
}