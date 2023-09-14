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
        public static Dictionary<string, ValueSchema> GetSchema(this Type model)
        {
            Dictionary<string, ValueSchema> schemas = new();

            // For each property in the model
            PropertyInfo[] properties = model.GetProperties();
            foreach (PropertyInfo property in properties) {
                // Schema is built only for top level properties
                if (!property.PropertyType.IsPrimitive && !property.PropertyType.IsArray) { continue; }

                ValueSchema? schema = property.GetSchema();
                if (schema == null) { continue; }
                schemas[schema.Name] = schema;
            }

            return schemas;
        }

        /// <summary>
        /// Generates a schema of the model to be serialized as JSON and used with JS.
        /// This is useful because it prevents duplication of validation rules between front-end and back-end.
        /// </summary>
        public static ValueSchema? GetSchema(this PropertyInfo property)
        {
            // Schema is built only for top level properties
            if (!property.PropertyType.IsPrimitive && !property.PropertyType.IsArray) { return null; }

            ValueSchema schema = new();
            schema.Name = property.Name.FirstCharToLowerCase();

            // Get the property type
            string propertyType = property.PropertyType.Name.ToLower();
            if (property.PropertyType.IsEnum) { propertyType = "enum"; }
            // If the type if nullable, the real type is the underlying one
            Type? nullableType = Nullable.GetUnderlyingType(property.PropertyType);
            if (nullableType != null) { propertyType = nullableType.Name.ToLower(); }

            // Determine if it is required
            schema.Required = (property.GetCustomAttribute<RequiredAttribute>() != null);

            // TODO do lists even work?

            // Determine the type and its validation rules
            switch (propertyType)
            {
                case "string":
                    schema.Type = "string";

                    // Min max
                    var lengthAttr = property.GetCustomAttribute<StringLengthAttribute>();
                    if (lengthAttr != null)
                    {
                        schema.Min = lengthAttr.MinimumLength;
                        schema.Max = lengthAttr.MaximumLength;
                    }

                    // Email format regex
                    var emailAttr = property.GetCustomAttribute<EmailAddressAttribute>();
                    if (emailAttr != null) { schema.Type = "email"; }
                    break;
                case "int":
                case "int32":
                case "int64":
                    schema.Type = "int";

                    // Min max
                    var rangeAttr = property.GetCustomAttribute<RangeAttribute>();
                    if (rangeAttr != null)
                    {
                        schema.Min = rangeAttr.Minimum;
                        schema.Max = rangeAttr.Maximum;
                    }
                    break;
                case "enum":
                    // Enums are ints in the front-end with a limited set of values
                    schema.Type = "int";
                    schema.Options = EnumUtils.GetValuesAsObject(property.PropertyType);
                    break;
                case "bool":
                case "boolean":
                    schema.Type = "bool";
                    break;
            }

            return null;
        }
    }
}