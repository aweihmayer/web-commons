const Validator = {
    /**
     * Parses a value into the desired type and validates it.
     * @param {any} value
     * @param {ValueSchema} schema
     * @returns {{ value: any, isValid: boolean, error: string, message: string, schema: ValueSchema }}
     */
    validate: function (value, schema) {
        schema = schema || new ValueSchema();

        let result = {
            value: value,
            isValid: true,
            error: null,
            message: null,
            schema: schema
        };

        try {
            result.value = Parser.parse(value, schema.type);
            if (!schema.isEnumerable && Array.isArray(result.value)) {
                if (result.value.length === 0) { result.value = null; }
                else if (result.value.length === 1) { result.value = result.value[0]; }
                else { throw new Error('type'); }
            }

            if (!schema.isNullable) {
                if (Array.isArray(result.value)) { result.value = value.filter(v => (v !== null || typeof v !== 'undefined')); }
                else if (result.value === null || typeof result.value === 'undefined') { throw new Error('type'); }
            }

            if (schema.required) { Validator.required(result.value, schema); }
            if (typeof Validator[schema.type] !== 'function') { throw new Error('You must define how to valide the type ' + schema.type); }
            Validator[schema.type](result.value, schema);
            return result;
        } catch (ex) {
            result.error = ex.message;
            result.isValid = false;
            result.message = Validator.getMessage(result.error, schema);
            return result;
        }
    },

    /**
     * Returns an error message.
     * @param {string} error
     * @param {ValueSchema} [schema]
     * @returns {string}
     */
    getMessage: function (error, schema) {
        schema = schema || {};
        let type = schema.type || 'default';
        let message = Validator.messages[error];
        return (error === 'required') ? message : message[type].t(schema);
    },

    messages: {
        required: 'Required',
        type: {
            default: 'Wrong type',
            email: 'Must be an email',
            int: 'Must be an integer',
            number: 'Must be a number',
        },
        min: {
            default: 'Must be bigger',
            int: 'Must be more than {min}',
            number: 'Must be more than {min}',
            string: 'Must be more than {min} characters long',
            email: 'Must be more than {min} characters long'
        },
        max: {
            default: 'Must be smaller',
            int: 'Must be less than {max}',
            number: 'Must be less than {max}',
            string: 'Must be less than {max} characters long',
            email: 'Must be less than {max} characters long'
        }
    }
};