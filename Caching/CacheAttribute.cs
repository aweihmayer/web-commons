namespace WebCommons.Controllers
{
    /// <summary>
    /// Placed on an action to add caching.
    /// If the action has a <see cref="JsRouteAttribute"/>, we use <see href="https://developer.mozilla.org/en-US/docs/Web/API/Cache">JS cache service worker</see>.
    /// Other we use <see href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control">caching headers</see>.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public class CacheAttribute : Attribute
	{
		public TimeSpan Duration { get; set; }
		public string Name { get; set; }

        public CacheAttribute(int seconds = 0, int minutes = 0, int hours = 0, int days = 0, int weeks = 0, int months = 0, string name = null)
        {
            days += (weeks * 7);
            days += (months * 30);
            this.Duration = new TimeSpan(days, hours, minutes, seconds);
            this.Name = name;
        }
    }
}