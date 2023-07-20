using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using System.Web;
using WebCommons.Utils;

namespace WebCommons.Model
{
    /// <summary>
    /// Defines the values of a request.
    /// </summary>
    public static class ModelExtensions
    {
        // TODO remove these constants, use a custom attribute instead
        public const int EMAIL_MAX = 255;
        public const string EMAIL_REGEX = "^.*@.*\\..*$";
        public const int PASSWORD_MAX = 50;

        /// <summary>
        /// Determines if the model is valid.
        /// </summary>
        public static bool IsValidModel(this object obj)
		{
            ValidationContext context = new(obj);
            List<ValidationResult> results = new();
            return Validator.TryValidateObject(obj, context, results, true);
		}

        #region Query string

        /// <summary>
        /// Gets the query string parameters of an object.
        /// </summary>
        public static Dictionary<string, object> GetQueryStringParams(this Dictionary<string, object> obj)
        {
            return obj;
        }

        /// <summary>
        /// Gets the query string parameters of an object.
        /// </summary>
        /// <param name="onlyPropertiesWithQueryAttribute">If true, only properties with the <see cref="FromQueryAttribute" /> will be collected.</param>
        public static Dictionary<string, object> GetQueryStringParams(this object obj, bool onlyPropertiesWithQueryAttribute = true)
        {
            if (obj == null) { return new Dictionary<string, object>(); }

            Type type = obj.GetType();
            PropertyInfo[] props = type.GetProperties();

            Dictionary<string, object> query = new();

            foreach (PropertyInfo prop in props) {
                if (!prop.PropertyType.IsPrimitive && !prop.PropertyType.IsArray) { continue; }
                string name = prop.Name;

                if (onlyPropertiesWithQueryAttribute) {
                    FromQueryAttribute? queryAttribute = prop.GetCustomAttribute<FromQueryAttribute>();
                    if (queryAttribute == null) { continue; }
                    if (!string.IsNullOrEmpty(queryAttribute.Name)) { name = queryAttribute.Name; }
                }

                object? value = prop.GetValue(obj);
                if (value != null) { query.Add(name, value); }
            }

            return query;
        }

        /// <summary>
        /// Transforms a dictionary into a query string.
        /// </summary>
        public static string ToQueryString(this Dictionary<string, object> parameters)
        {
            List<string> query = new();
            foreach (KeyValuePair<string, object> param in parameters)
            {
                query.Add(param.Key.FirstCharToLowerCase() + "=" + HttpUtility.UrlEncode(param.Value.ToString()));
            }

            return (query.Count == 0) ? "" : "?" + String.Join("&", query.ToArray());
        }

        /// <summary>
        /// Transforms an object into a query string.
        /// </summary>
        /// <param name="onlyPropertiesWithQueryAttribute">If true, only properties will the query string attribute will be transformed.</param>
        public static string ToQueryString(this object obj, bool onlyPropertiesWithQueryAttribute = true)
        {
            return obj.GetQueryStringParams(onlyPropertiesWithQueryAttribute).ToQueryString();
        }

        #endregion

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

                ValueSchema schema = new();
                schemas[property.Name] = schema;

                // Get the property type
                string propertyType = property.PropertyType.Name.ToLower();
                if (property.PropertyType.IsEnum) { propertyType = "enum"; }
                // If the type if nullable, the real type is the underlying one
                Type? nullableType = Nullable.GetUnderlyingType(property.PropertyType);
                if (nullableType != null) { propertyType = nullableType.Name.ToLower(); }

                // Determine if it is required
                schema.Required = (property.GetCustomAttribute<RequiredAttribute>() != null);

                // Determine the type and its validation rules
                switch (propertyType) {
                    case "string":
                        schema.Type = "string";

                        // Min max
                        var lengthAttr = property.GetCustomAttribute<StringLengthAttribute>();
                        if (lengthAttr != null) {
                            schema.Min = lengthAttr.MinimumLength;
                            schema.Max = lengthAttr.MaximumLength;
                        }
                        
                        // Email format regex
                        var emailAttr = property.GetCustomAttribute<EmailAddressAttribute>();
                        if (emailAttr != null) { schema.Regex = EMAIL_REGEX; } // TODO email type in front end
                        break;
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
                    default:
                        continue;
                }
            }

            return schemas;
        }
    }
}