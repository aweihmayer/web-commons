﻿/** 
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
            // Parse and validate according to the schema type
            switch (schema.type) {
                case 'int':
                    result.value = Number.parseInt2(v);
                    Number.validate(results.value, schema);
                    break;
                case 'number':
                    break;
                case 'string':
                    result.value = String.parse(v);
                    String.validate(v, schema);
                    break;
                case 'bool':
                    result.value = Boolean.parse(v);
                    Boolean.validate(result.value, schema);
                    break;
                default:
                    throw new Error('type');
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
        let message = Validation.mesages[error];
        // Get the error data type message
        if (!['required', 'regex'].includes(error)) {
            message = message[schema.type];
        }

        return message.i18n(schema);
    },

    /**
     * The default error messages.
     */
    messages = {
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
        }
    }
};