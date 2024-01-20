namespace System.Reflection
{
    public static class ReflectionExtensions
    {
        public static T? GetPropertyValue<T>(this Type type, object obj, string propertyName)
        {
            object value = type.GetProperty(propertyName).GetValue(obj);
            if (value == null) return default;
            else return (T)value;
        }

        public static void SetPropertyValue(this Type type, object obj, string propertyName, object value)
        {
            type.GetProperty(propertyName).SetValue(obj, value);
        }

        public static bool HasCustomAttribute<T>(this Type type) where T : Attribute
        {
            return type.GetCustomAttribute<T>() != null;
        }
    }
}
