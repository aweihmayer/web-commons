const Parser = {
    /**
     * Parses a value
     * @param {any} value
     * @param {string} type
     * @param {ValueSchema} schema
     */
    parse: function (value, type, schema) {
        schema = schema || new ValueSchema();

        if (typeof this[type] !== 'function') {
            console.warn('No function defined to parse the type ' + type);
            return value;
        }

        let parsed = this[type](value);
        if (typeof schema === 'undefined') return parsed;

        // Parse enumerables
        if (!schema.isEnumerable && Array.isArray(parsed)) {
            if (parsed.length === 0) parsed = null;
            else if (parsed.length === 1) parsed = parsed[0];
            else throw new Error('type');
        } else if (schema.isEnumerable && !Array.isArray(parsed)) {
            parsed = [parsed];
        }

        // Parse nulls
        if (schema.isNullable) {
            return parsed;
        } else if (Array.isArray(parsed)) {
            return parsed.filter(v => (v !== null && typeof v !== 'undefined'));
        } else if (parsed === null || typeof parsed === 'undefined') {
            if (schema.default) { return schema.default; }
            throw new Error('type');
        } else {
            return parsed;
        }
    }
};