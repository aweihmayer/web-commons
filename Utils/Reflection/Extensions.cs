namespace System.Reflection
{
    public static class ReflectionExtensions
    {
        /// <summary>
        /// Returns the property value of a specified object.
        /// </summary>
        public static T? GetPropertyValue<T>(this Type type, object obj, string name)
        {
            if (type == null || string.IsNullOrEmpty(name)) return default;
            var property = type.GetProperty(name);
            if (property == null) return default;
            object value = property.GetValue(obj);
            if (value == null) return default;
            else return (T)value;
        }

        /// <summary>
        /// Sets the property value of a specified object.
        /// </summary>
        public static void SetPropertyValue(this Type type, object obj, string name, object value)
        {
            if (type == null || string.IsNullOrEmpty(name)) return;
            var property = type.GetProperty(name);
            if (property == null) return;
            property.SetValue(obj, value);
        }

        /// <summary>
        /// Determines if a type has an attribute.
        /// </summary>
        public static bool HasAttribute<T>(this Type type) where T : Attribute
        {
            return type.GetCustomAttribute<T>() != null;
        }
    }
}
