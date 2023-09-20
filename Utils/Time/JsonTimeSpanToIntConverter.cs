using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace WebCommons.Utils
{
    public class JsonTimeSpanToIntConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            if (value is TimeSpan timeSpan) {
                writer.WriteValue((int)timeSpan.TotalMilliseconds);
            } else if (value is TimeSpan? && ((TimeSpan?)value).HasValue) {
                var nullableTimeSpan = (TimeSpan?)value;
                writer.WriteValue((int)nullableTimeSpan.Value.TotalMilliseconds);
            } else if (value is null) {
                writer.WriteNull();
            } else {
                throw new JsonSerializationException("Expected TimeSpan or TimeSpan?, but got an unsupported type");
            }
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            JToken token = JToken.Load(reader);

            if (token.Type == JTokenType.Integer) {
                return TimeSpan.FromMilliseconds(token.Value<int>());
            } else if (token.Type == JTokenType.Null) {
                return null;
            }

            throw new JsonSerializationException("Expected integer value for TimeSpan");
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(TimeSpan) || objectType == typeof(TimeSpan?);
        }
    }
}
