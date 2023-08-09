namespace System.Reflection
{
    public static class Extensions
    {
        public static T? GetPropertyValue<T>(this Type type, object obj, string propertyName)
        {
            object value = type.GetProperty(propertyName).GetValue(obj);
            if (value == null) { return default; }
            return (T)value;
        }

        public static void SetPropertyValue(this Type type, object obj, string propertyName, object value)
        {
            type.GetProperty(propertyName).SetValue(obj, value);
        }
    }
}
