using Newtonsoft.Json;

namespace WebCommons.Model
{
    /// <summary>
    /// Defines how a value will be validated.
    /// </summary>
    public class ValueSchema
    {
        [JsonProperty("name")]
        public string Name { get; set; } = string.Empty;

        [JsonProperty("type")]
        public string Type { get; set; } = "string";

        [JsonProperty("required")]
        public bool Required { get; set; } = false;

        [JsonProperty("min", NullValueHandling = NullValueHandling.Ignore)]
        public object? Min { get; set; } = null;

        [JsonProperty("max", NullValueHandling = NullValueHandling.Ignore)]
        public object? Max { get; set; } = null;

        [JsonProperty("regex", NullValueHandling = NullValueHandling.Ignore)]
        public string? Regex { get; set; } = null;

        [JsonProperty("isEnumerable", NullValueHandling = NullValueHandling.Ignore)]
        public bool? IsEnumerable { get; set; } = null;

        [JsonProperty("options", NullValueHandling = NullValueHandling.Ignore)]
        public object[]? Options { get; set; } = null;
    }
}