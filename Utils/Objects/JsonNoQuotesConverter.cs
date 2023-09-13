using Newtonsoft.Json;

namespace WebCommons.Utils
{
    public class JsonNoQuotesConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            if (value is string strValue) {
                writer.WriteRawValue(strValue);
            } else {
                throw new InvalidOperationException("Expected a string value.");
            }
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException("Deserialization is not supported for a string value with no quote.");
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(string);
        }
    }
}
