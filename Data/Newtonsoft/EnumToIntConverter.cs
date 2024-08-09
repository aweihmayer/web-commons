namespace Newtonsoft.Json.Converters
{
    /// <summary>
    /// Transforms an enum into an integer.
    /// Used on enum properties when they are serialized into JSON.
    /// </summary>
    public class JsonEnumToIntConverter : StringEnumConverter
    {
        public JsonEnumToIntConverter()
        {
            this.AllowIntegerValues = true;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            if (value is Enum) writer.WriteValue((int)value);
            else base.WriteJson(writer, value, serializer);
        }
    }
}
