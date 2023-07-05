using Newtonsoft.Json;

namespace WebCommons.Dto
{
    /// <summary>
    /// Defines a mapping of data, from entities or other objects, that are sent externally.
    /// They are useful because:
    /// <list type="bullet">
    ///     <item>They make it so that you don't expose your database structure by sending entities in your responses. Though, by itself, this is not particularily unsafe.</item>
    ///     <item>They make development easier by your response data structure is not fixed to the database's.</item>
    /// </list>
    /// </summary>
    public abstract class CommonDto
    {
        [JsonProperty("system", NullValueHandling = NullValueHandling.Ignore)]
        public SystemDto System { get; set; }
    }
}