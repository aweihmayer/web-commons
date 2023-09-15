/** 
 * Validates and converts values.
 */
const Validator = {
    /**
     * Parses a value into the desired type and validates it.
     * @param {any} v
     * @param {ValueSchema} schema
     * @returns {{ value: any, isValid: boolean, error: string, message: string }}
     */
    validate: function (v, schema) {
        schema = schema || new ValueSchema();

        let result = {
            value: v,
            isValid: true,
            error: null,
            message: null
        };

        try {
            result.value = Parser.parse(v, schema.type);
            switch (schema.type) {
                case 'email': Validator.email(result.value, schema); break;
                case 'int':
                case 'number': Validator.number(result.value, schema); break;
                case 'string': Validator.string(result.value, schema); break;
                default: throw new Error('type');
            }

            // If the value is not required, no further validation is done
            if (!schema.required) { return result; }

            // If the value is required and an array, remove empty values and check if the array is empty
            if (Array.isArray(result.value)) {
                result.value = result.value.filterEmpty();
                if (result.value.isEmpty()) { throw new Error('required'); }
            }

            // If the value is required, check if it is empty
            if (result.value === null || result.value === '') { throw new Error('required'); }
            return result;
        } catch (ex) {
            result.error = ex.message;
            result.message = Validator.getMessage(ex.message, schema);
            return result;
        }
    },

    /**
     * Returns an error message.
     * @param {'required'|'type'|'min'|'max'|'regex'} error
     * @param {ValueSchema} [schema] Used for replacing placeholders.
     * @returns {string}
     */
    getMessage: function (error, schema) {
        schema = schema || {};
        schema.type = schema.type || 'default';

        // Get the error type messages
        let message = Validator.messages[error];
        // Get the error data type message
        if (!['required', 'regex'].includes(error)) {
            message = message[schema.type];
        }

        return message.i18n(schema);
    },

    /**
     * The default error messages.
     */
    messages: {
        required: 'Required',
        regex: 'Invalid format',
        type: {
            default: 'Wrong type',
            int: 'Must be an integer',
            number: 'Must be a number',
        },
        min: {
            default: 'Must be bigger',
            int: 'Must be more than {min}',
            number: 'Must be more than {min}',
            string: 'Must be more than {min} characters long'
        },
        max: {
            default: 'Must be smaller',
            int: 'Must be less than {max}',
            number: 'Must be less than {max}',
            string: 'Must be less than {max} characters long'
        },
        "default": {
            "type": "Wrong type",
                "min": "Must be bigger",
                    "max": "Must be smaller"
        },

        "int": {
            "type": "Must be an integer",
                "min": "Must be more than {min}",
                    "max": "Must be less than {max}"
        },

        "number": {
            "type": "Must be a number",
                "min": "Must be more than {min}",
                    "max": "Must be less than {max}"
        },

        "string": {
            "type": "Wrong type",
                "min": "Must be more than {min} characters long",
                    "max": "Must be less than {max} characters long"
        }
    }
};