const Parser = {
    /**
     * Parses a value
     * @param {any} value
     * @param {string} type The target type.
     * @param {ValueSchema} schema The schema that contains extra information.
     */
    parse: function (value, type, schema) {
        // Determine if the parsing function exists
        if (typeof this[type] !== 'function') {
            console.warn('No function defined to parse the type ' + type);
            return value;
        }

        // Parse the value to the desired type
        let parsed = this[type](value);

        // If schema is undefined, nothing else to do
        if (isUndefined(schema)) return parsed;
        // Parse non-enumerable
        else if (!schema.isEnumerable && isArray(parsed)) {
            if (parsed.length === 0) parsed = null;
            else if (parsed.length === 1) parsed = parsed[0];
            else throw new Error('type');
        // Parse enumerable
        } else if (schema.isEnumerable && !isArray(parsed)) {
            parsed = [parsed];
        }

        // Nulls are allowed, nothing else to do
        if (schema.isNullable) return parsed;
        // Remove nulls from array
        else if (isArray(parsed)) return parsed.filterNull();
        // Value is null, return default or throw an error
        else if (isNull(parsed)) {
            if (schema.default) return schema.default;
            else throw new Error('type');
        // Nothing to do
        } else return parsed;
    }
};