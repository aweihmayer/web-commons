/**
 * Determines if a value is null or empty.
 * @param {any} value
 * @returns {boolean}
 */
function isEmpty(value) {
    if (typeof value === 'object' && value !== null) return !Object.keys(value).any();
    else return (isNull(value) || value === '');
}

/**
 * Determines if a value is null.
 * @param {any} value
 * @returns {boolean}
 */
function isNull(value) { return (typeof value === 'undefined' || value === null); }