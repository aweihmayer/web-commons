const Validator = {
    /**
     * Parses a value into the desired type and validates it.
     * @param {any} value The value being validate.
     * @param {string} type The expected type of the value being validated.
     * @param {ValueSchema} [schema] Schema for extra validation rules.
     * @returns {{ value: any, isValid: boolean, error: string, message: string, schema: ValueSchema }}
     */
    validate: function (value, type, schema) {
        schema = schema ?? new ValueSchema();
        let result = {
            value: value,
            isValid: true,
            error: null,
            message: null,
            schema: schema
        };

        // Try to validate
        try {
            result.value = Parser.parse(value, type, schema);
            if (schema.isRequired) this.required(result.value, schema);
            if (typeof this[type] !== 'function') console.warn('No function defined to validate the type ' + type);
            this[schema.type](result.value, schema);
            return result;
        // The validation failed
        } catch (ex) {
            result.error = ex.message;
            result.isValid = false;
            result.message = this.getMessage(result.error, schema);
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
            console.warn('No main error message defined for ' + error);
            return 'Error';
        }

        let message = Validator.messages[error];
        if (error === 'required') {
            return message;
        } else if (!message.hasOwnProperty(type)) {
            console.warn('No sub error message defined for ' + type);
            return 'Error';
        } else {
            return translate(message[type], schema);
        }
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