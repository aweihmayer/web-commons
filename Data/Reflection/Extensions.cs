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

        /// <summary>
        /// Determines if a parameter has an attribute.
        /// </summary>
        public static bool HasAttribute<T>(this ParameterInfo param) where T : Attribute
        {
            return param.GetCustomAttribute<T>() != null;
        }

        /// <summary>
        /// Determines if a method has an attribute.
        /// </summary>
        public static bool HasAttribute<T>(this MethodInfo method) where T : Attribute
        {
            return method.GetCustomAttribute<T>() != null;
        }

        /// <summary>
        /// Determines if a type is a list.
        /// </summary>
        public static bool IsList(this Type type)
        {
            return type.IsGenericType && type.GetGenericTypeDefinition() == typeof(List<>);
        }

        /// <summary>
        /// Determines if a type is a list.
        /// </summary>
        public static bool IsNullable(this Type type)
        {
            Type? nullableType = Nullable.GetUnderlyingType(type);
            return (nullableType != null);
        }

        public static Type GetNullableUnderlyingType(this Type type)
        {
            return type.IsNullable() ? Nullable.GetUnderlyingType(type) : type;
        }

        public static Type GetBaseType(this Type type)
        {
            Type propertyType;
            
            // If the type if nullable, the real type is the underlying one
            Type? nullableType = Nullable.GetUnderlyingType(type);
            if (nullableType != null) propertyType = nullableType;
            else propertyType = type;

            Type[] genericTypes = propertyType.GetGenericArguments();
            if (genericTypes.Any()) return genericTypes.First();
            else return propertyType;
        }

        public static string GetStringType(this Type type)
        {
            Type baseType = type.GetBaseType();
            if (baseType.IsEnum) return "enum";
            else return baseType.Name;
        }
    }
}
