const Parser = {
    /**
     * Parses a value
     * @param {any} value
     * @param {string} type The target type.
     * @param {ValueSchema} schema The schema that contains extra information.
     */
    parse: function (value, type, schema) {
        schema = schema ?? new ValueSchema();

        // Parse the value
        if (typeof this[type] !== 'function') {
            console.warn('No function defined to parse the type ' + type);
            return value;
        }

        let parsed = this[type](value);

        // Nothing else to do
        if (typeof schema === 'undefined') return parsed;
        // Parse non-enumerable
        else if (!schema.isEnumerable && Array.isArray(parsed)) {
            if (parsed.length === 0) parsed = null;
            else if (parsed.length === 1) parsed = parsed[0];
            else throw new Error('type');
        // Parse enumerable
        } else if (schema.isEnumerable && !Array.isArray(parsed)) {
            parsed = [parsed];
        }

        // Nulls are allowed, nothing else to do
        if (schema.isNullable) return parsed;
        // Remove nulls from array
        else if (Array.isArray(parsed)) return parsed.filterNull();
        // Value is null, return default or throw an error
        else if (isNull(parsed)) {
            if (schema.default) return schema.default;
            else throw new Error('type');
        // Nothing to do
        } else return parsed;
    }
};