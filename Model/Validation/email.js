/**
 * Validates an email value.
 * @param {string} v
 * @param {ValueSchema} options
 * @throws {Error}
 * @returns {boolean}
 */
Validator.email = (v, options) => {
    // Recursivity for arrays
    if (Array.isArray(v)) {
        for (let i in v) { Validator.email(v[i], options); }
        return true;
    }

    if (typeof v !== 'string') { throw new Error('type'); }

    // Validate minimum
    if (v === null || v.length < 5) {
        throw new Error('min');
    }

    // Validate maximum
    if (v.length > 255) {
        throw new Error('max');
    }

    // Validate regex
    let regex = new RegExp("^.*@.*\\..*$");
    if (!regex.test(v)) { throw new Error('regex'); }

    return true;
}