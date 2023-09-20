using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace WebCommons.Utils
{
    public class JsonEnumToIntConverter : StringEnumConverter
    {
        public JsonEnumToIntConverter()
        {
            this.AllowIntegerValues = true;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            if (value is Enum) {
                writer.WriteValue((int)value);
            } else {
                base.WriteJson(writer, value, serializer);
            }
        }
    }
}
