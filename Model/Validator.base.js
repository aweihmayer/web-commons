/** 
 * Validates and converts values.
 */
const Validator = {
    /**
     * Parses a value into the desired type and validates it.
     * @param {any} value
     * @param {ValueSchema} schema
     * @returns {{ value: any, isValid: boolean, error: string, message: string }}
     */
    validate: function (value, schema) {
        schema = schema || new ValueSchema();

        let result = {
            value: value,
            isValid: true,
            error: null,
            message: null
        };

        try {
            result.value = Parser.parse(value, schema.type);

            if (schema.isNullable === false) {
                if (Array.isArray(result.value)) { result.value.filter(v => v !== null); }
                else if (result.value === null) { throw new Error('type'); }
            }

            if (schema.required) { Validator.required(result.value, schema); }

            if (typeof Validator[schema.type] === 'function') { Validator[schema.type](result.value, schema); }
            else { throw new Error('You must define how to valide the type ' + schema.type); }

            return result;
        } catch (ex) {
            result.error = ex.message;
            result.isValid = false;
            result.message = Validator.getMessage(result.error, schema);
            return result;
        }
    },

    required: (value) => {
        if (Array.isArray() && value.length === 0) { throw new Error('required'); }
        else if (value === null || value === '' || typeof value === 'undefined') { throw new Error('required'); }
        return true;
    },

    /**
     * Returns an error message.
     * @param {'required'|'type'|'min'|'max'|'regex'} error
     * @param {ValueSchema} [schema] Used for replacing placeholders.
     * @returns {string}
     */
    getMessage: function (error, schema) {
        schema = schema || {};
        let type = schema.type || 'default';
        let message = Validator.messages[error];
        return (error !== 'required') ? message = message[type] : message.t(schema);
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