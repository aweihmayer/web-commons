using Newtonsoft.Json;

namespace WebCommons.Model
{
    /// <summary>
    /// Defines the properties of a value for validation and parsing reasons.
    /// </summary>
    public class ValueSchema
    {
        /// <summary>
        /// Defines the name of the property that holds the value when writing to an object. Useful for collecting data from inputs.
        /// </summary>
        [JsonProperty("name")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Defines the name of the property that holds the value when reading from a source. Useful for filling inputs.
        /// </summary>
        [JsonProperty("fill", NullValueHandling = NullValueHandling.Ignore)]
        public string? Fill { get; set; }

        /// <summary>
        /// Defines the label of the value's input.
        /// </summary>
        [JsonProperty("label", NullValueHandling = NullValueHandling.Ignore)]
        public string? Label { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; } = "string";

        [JsonProperty("isRequired")]
        public bool IsRequired { get; set; } = false;

        [JsonProperty("isEnumerable")]
        public bool IsEnumerable { get; set; } = false;

        [JsonProperty("isNullable")]
        public bool IsNullable { get; set; } = false;

        [JsonProperty("min", NullValueHandling = NullValueHandling.Ignore)]
        public object? Min { get; set; } = null;

        [JsonProperty("max", NullValueHandling = NullValueHandling.Ignore)]
        public object? Max { get; set; } = null;

        /// <summary>
        /// Defines the regex the value must conform to be valid.
        /// </summary>
        [JsonProperty("regex", NullValueHandling = NullValueHandling.Ignore)]
        public string? Regex { get; set; } = null;

        /// <summary>
        /// Defines the possible values that the value must conform to be be valid.
        /// </summary>
        [JsonProperty("values", NullValueHandling = NullValueHandling.Ignore)]
        public object[]? Values { get; set; } = null;

        [JsonProperty("default", NullValueHandling = NullValueHandling.Ignore)]
        public object? DefaultValue { get; set; } = null;

        [JsonProperty("const", NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, object>? Constants { get; set; } = null;

        [JsonProperty("i18n", NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<object, object>? I18n { get; set; } = null;

        [JsonProperty("colors", NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<object, object>? Colors { get; set; } = null;

        [JsonExtensionData]
        public Dictionary<object, object> Data { get; set; } = new();
    }
}