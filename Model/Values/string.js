/**
 * Validates a string value.
 * @param {string} v
 * @param {ValueSchema} options
 * @throws {Error}
 * @returns {boolean}
 */
Validator.string = function (v, options) {
    // Recursivity for arrays
    if (Array.isArray(v)) {
        for (let i in v) { Validator.string(v[i], options); }
        return true;
    }

    // Validate minimum
    if (typeof options.min === 'number'
    && (v === null || v.length < options.min)) {
        throw new Error('min');
    }

    // Validate maximum
    if (typeof options.max === 'number'
    && v !== null
    && v.length > options.max) {
        throw new Error('max');
    }

    // Validate regex
    if (typeof options.regex === 'string') {
        let regex = new RegExp(this.schema.regex);
        if (!regex.test(v)) { throw new Error('regex'); }
    }

    return true;
};