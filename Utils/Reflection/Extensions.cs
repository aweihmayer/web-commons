namespace System.Reflection
{
    public static class ReflectionExtensions
    {
        public static T? GetPropertyValue<T>(this Type type, object obj, string propertyName)
        {
            if (type == null || string.IsNullOrEmpty(propertyName)) return default;
            PropertyInfo property = type.GetProperty(propertyName);
            if (property == null) return default;
            object value = property.GetValue(obj);
            if (value == null) return default;
            else return (T)value;
        }

        public static void SetPropertyValue(this Type type, object obj, string propertyName, object value)
        {
            if (type == null || string.IsNullOrEmpty(propertyName)) return;
            PropertyInfo property = type.GetProperty(propertyName);
            if (property == null) return;
            property.SetValue(obj, value);
        }

        public static bool HasCustomAttribute<T>(this Type type) where T : Attribute
        {
            return type.GetCustomAttribute<T>() != null;
        }
    }
}
