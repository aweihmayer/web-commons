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
            result.value = Parser.parse(value, schema.type, schema);

            if (schema.isRequired) {
                Validator.required(result.value, schema);
            }

            if (typeof Validator[schema.type] !== 'function') {
                console.warn('No function has been defined to validate the type ' + schema.type);
            } else {
                Validator[schema.type](result.value, schema);
            }
            
            return result;
        } catch (ex) {
            console.warn('Validation error', ex);
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
        if (!Validator.messages.hasOwnProperty(error)) {
            console.warn('You must define the main error message for ' + error);
            return 'Error';
        }

        let message = Validator.messages[error];
        if (error === 'required') { return message; }
        if (!message.hasOwnProperty(type)) {
            console.warn('You must define the sub error message for ' + type);
            return 'Error';
        }
        return message[type].t(schema);
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