/**
 * Validates a number value.
 * @param {number} v
 * @param {ValueSchema} options
 * @throws {Error}
 * @returns {boolean}
 */
Validator.number = function (v, options) {
    // Recursivity for arrays
    if (Array.isArray(v)) {
        for (let i in v) { Validator.number(v[i], options); }
        return true;
    }

    // Validate minimum
    if (typeof options.min === 'number'
    && (v === null || v < options.min)) {
        throw new Error('min');
    }

    // Validate maximum
    if (typeof options.max === 'number'
    && v !== null
    && v > options.max) {
        throw new Error('max');
    }

    return true;
};