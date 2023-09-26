using System.ComponentModel.DataAnnotations;
using System.Reflection;
using WebCommons.Utils;

namespace WebCommons.Model
{
    /// <summary>
    /// Defines the values of a request.
    /// </summary>
    public static class ValueSchemaExtensions
    {
        /// <summary>
        /// Generates a schema of the model to be serialized as JSON and used with JS.
        /// This is useful because it prevents duplication of validation rules between front-end and back-end.
        /// </summary>
        public static Dictionary<string, ValueSchema> BuildSchema(this Type model)
        {
            Dictionary<string, ValueSchema> schemas = new();

            // For each property in the model
            PropertyInfo[] properties = model.GetProperties();
            foreach (PropertyInfo property in properties) {
                ValueSchema? schema = property.BuildSchema();
                if (schema == null) { continue; }
                schemas[schema.Name] = schema;
            }

            return schemas;
        }

        /// <summary>
        /// Generates a schema of the model to be serialized as JSON and used with JS.
        /// This is useful because it prevents duplication of validation rules between front-end and back-end.
        /// </summary>
        public static ValueSchema? BuildSchema(this PropertyInfo property)
        {
            ValueSchema schema = new();
            schema.Name = property.Name.FirstCharToLowerCase();

            // Get the property type
            Type propertyType;
            string propertyTypeName;
            
            // If the type if nullable, the real type is the underlying one
            Type? nullableType = Nullable.GetUnderlyingType(property.PropertyType);
            if (nullableType != null) {
                schema.IsNullable = true;
                propertyType = nullableType;
            } else {
                schema.IsNullable = false;
                propertyType = property.PropertyType;
            }

            Type[] genericTypes = propertyType.GetGenericArguments();
            if (genericTypes.Any()) {
                propertyType = genericTypes.First();
                schema.IsEnumerable = true;
            }

            if (propertyType.IsEnum) { propertyTypeName = "enum"; }
            else { propertyTypeName = propertyType.Name.ToLower(); }

            // Determine if it is required
            schema.Required = (property.GetCustomAttribute<RequiredAttribute>() != null);

            // Determine the type and its validation rules
            switch (propertyTypeName) {
                case "string":
                    schema.IsNullable = true;

                    // Email format regex
                    var emailAttr = property.GetCustomAttribute<EmailAddressAttribute>();
                    if (emailAttr != null) {
                        schema.Type = "email";
                        schema.Min = 5;
                        schema.Max = 255;
                        return schema;
                    }

                    // Normal string
                    schema.Type = "string";
                    var lengthAttr = property.GetCustomAttribute<StringLengthAttribute>();
                    if (lengthAttr != null) {
                        schema.Min = lengthAttr.MinimumLength;
                        schema.Max = lengthAttr.MaximumLength;
                    }
                    
                    return schema;
                case "int":
                case "int32":
                case "int64":
                    schema.Type = "int";
                    // Min max
                    var rangeAttr = property.GetCustomAttribute<RangeAttribute>();
                    if (rangeAttr != null) {
                        schema.Min = rangeAttr.Minimum;
                        schema.Max = rangeAttr.Maximum;
                    }

                    return schema;
                case "enum":
                    // Enums are ints in the front-end with a limited set of values
                    schema.Type = "int";
                    schema.Values = EnumUtils.GetValuesAsObject(propertyType);
                    schema.Constants = propertyType.ToEnumConstMap();
                    return schema;
                case "bool":
                case "boolean":
                    schema.Type = "bool";
                    return schema;
                default:
                    return null;
            }
        }
    }
}