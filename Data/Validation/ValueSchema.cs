﻿using Newtonsoft.Json;
using System.Reflection;

namespace System.ComponentModel.DataAnnotations
{
    /// <summary>
    /// Defines the properties of a value for validation and parsing reasons.
    /// </summary>
    public class ValueSchema
    {
        /// <summary>
        /// Defines the name of the property that holds the value when writing to an object. Useful for collecting data from inputs.
        /// </summary>
        [JsonProperty("name")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Defines the name of the property that holds the value when reading from a source. Useful for filling inputs.
        /// </summary>
        [JsonProperty("fill", NullValueHandling = NullValueHandling.Ignore)]
        public string? Fill { get; set; }

        /// <summary>
        /// Defines the label of the value's input.
        /// </summary>
        [JsonProperty("label", NullValueHandling = NullValueHandling.Ignore)]
        public string? Label { get; set; }

        /// <summary>
        /// Defines the data type.
        /// </summary>
        [JsonProperty("type")]
        public string Type { get; set; } = "string";

        /// <summary>
        /// Defines if the value is required.
        /// </summary>
        [JsonProperty("isRequired")]
        public bool IsRequired { get; set; } = false;

        /// <summary>
        /// Defines if the value is a enumerable (a list).
        /// </summary>
        [JsonProperty("isEnumerable")]
        public bool IsEnumerable { get; set; } = false;

        /// <summary>
        /// Defines if the value can be null.
        /// </summary>
        [JsonProperty("isNullable")]
        public bool IsNullable { get; set; } = false;

        /// <summary>
        /// Defines the minimum value.
        /// </summary>
        [JsonProperty("min", NullValueHandling = NullValueHandling.Ignore)]
        public object? Min { get; set; } = null;

        /// <summary>
        /// Defines the maximum value.
        /// </summary>
        [JsonProperty("max", NullValueHandling = NullValueHandling.Ignore)]
        public object? Max { get; set; } = null;

        /// <summary>
        /// Defines the regex the value must conform to be valid.
        /// </summary>
        [JsonProperty("regex", NullValueHandling = NullValueHandling.Ignore)]
        public string? Regex { get; set; } = null;

        /// <summary>
        /// Defines the possible values that the value must conform to be be valid.
        /// </summary>
        [JsonProperty("values", NullValueHandling = NullValueHandling.Ignore)]
        public object[]? Values { get; set; } = null;

        /// <summary>
        /// Defines the default value.
        /// </summary>
        [JsonProperty("default", NullValueHandling = NullValueHandling.Ignore)]
        public object? DefaultValue { get; set; } = null;

        [JsonProperty("const", NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, object>? Constants { get; set; } = null;

        /// <summary>
        /// Defines the translation map for the value.
        /// </summary>
        [JsonProperty("i18n", NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<object, object>? I18n { get; set; } = null;

        /// <summary>
        /// Defines the color map for the value.
        /// </summary>
        [JsonProperty("colors", NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<object, object>? Colors { get; set; } = null;

        /// <summary>
        /// The preferred input component when this value is used in a form.
        /// </summary>
        [JsonProperty("component", NullValueHandling = NullValueHandling.Ignore)]
        public string? InputComponent { get; set; } = null;

        /// <summary>
        /// Defines additional data.
        /// </summary>
        [JsonExtensionData]
        public Dictionary<object, object> Data { get; set; } = new();

        private void Build(string name, Type type,
            EmailAddressAttribute? emailAttr = null,
            StringLengthAttribute? lengthAttr = null,
            RangeAttribute? rangeAttr = null,
            RequiredAttribute? requiredAttr = null,
            FillNameAttribute? fillAttr = null,
            DisplayNameAttribute? displayAttr = null
            )
        {
            this.Name = name.FirstCharToLower();

            this.IsRequired = (requiredAttr != null);
            if (fillAttr != null) this.Fill = fillAttr.Name;
            if (displayAttr != null) this.Label = displayAttr.DisplayName;

            // Get the property type
            Type propertyType;
            
            // If the type if nullable, the real type is the underlying one
            Type? nullableType = Nullable.GetUnderlyingType(type);
            if (nullableType != null) {
                this.IsNullable = true;
                propertyType = nullableType;
            } else {
                this.IsNullable = false;
                propertyType = type;
            }

            Type[] genericTypes = propertyType.GetGenericArguments();
            if (genericTypes.Any()) {
                propertyType = genericTypes.First();
                this.IsEnumerable = true;
            }

            string typeName;
            if (propertyType.IsEnum) typeName = "enum";
            else typeName = propertyType.Name;

            // Determine the type and its validation rules
            switch (typeName.ToLower()) {
                case "string":
                    this.IsNullable = true;

                    // Email format regex
                    if (emailAttr != null) {
                        this.Type = "email";
                        this.Min = 5;
                        this.Max = 255;
                    }

                    // Normal string
                    this.Type = "string";
                    if (lengthAttr != null) {
                        this.Min = (lengthAttr.MinimumLength > 0) ? lengthAttr.MinimumLength : null;
                        this.Max = (lengthAttr.MaximumLength > 0) ? lengthAttr.MaximumLength : null;
                    }

                    break;
                case "int":
                case "int32":
                case "int64":
                    this.Type = "int";
                    // Min max
                    if (rangeAttr != null) {
                        this.Min = rangeAttr.Minimum;
                        this.Max = rangeAttr.Maximum;
                    }

                    break;
                case "enum":
                    // Enums are ints in the front-end with a limited set of values
                    this.Type = "int";
                    this.Values = type.GetEnumsAsObjects();
                    this.Constants = type.GetEnumsAsConstantMap();
                    break;
                case "bool":
                case "boolean":
                    this.Type = "bool";
                    break;
            }
        }

        public ValueSchema(PropertyInfo property, object? instance = null)
        {
            this.DefaultValue = (instance != null) ? property.GetValue(instance) : null;

            this.Build(property.Name, property.PropertyType,
                emailAttr: property.GetCustomAttribute<EmailAddressAttribute>(),
                lengthAttr: property.GetCustomAttribute<StringLengthAttribute>(),
                rangeAttr: property.GetCustomAttribute<RangeAttribute>(),
                requiredAttr: property.GetCustomAttribute<RequiredAttribute>(),
                fillAttr: property.GetCustomAttribute<FillNameAttribute>(),
                displayAttr: property.GetCustomAttribute<DisplayNameAttribute>()); 
        }

        /// <summary>
        /// Generates a schema of the model to be serialized as JSON and used with JS.
        /// This is useful because it prevents duplication of validation rules between front-end and back-end.
        /// </summary>
        public static Dictionary<string, ValueSchema> BuildSchema(this Type model)
        {
            Dictionary<string, ValueSchema> schemas = new();

            // For each property in the model
            PropertyInfo[] properties = model.GetProperties();
            object instance = Activator.CreateInstance(model);
            foreach (PropertyInfo property in properties) {
                ValueSchema? schema = new(property, instance);
                if (schema != null) schemas[schema.Name] = schema;
            }

            return schemas;
        }
    }
}