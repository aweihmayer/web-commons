namespace Newtonsoft.Json.Converters
{
    /// <summary>
    /// Transforms a date to a different format.
    /// Used on date properties when they are serialized into JSON.
    /// </summary>
    public class JsonDateConverter : IsoDateTimeConverter
    {
        public JsonDateConverter() {
            base.DateTimeFormat = "yyyy-MM-dd";
        }

        public JsonDateConverter(string format)
        {
            base.DateTimeFormat = format;
        }
    }
}