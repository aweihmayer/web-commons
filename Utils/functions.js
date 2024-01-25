/**
 * Determines if a value is null or empty.
 * @param {any} value
 * @returns {boolean}
 */
function isEmpty(value) { return (isNull(v) || value === ''); }

/**
 * Determines if a value is null.
 * @param {any} value
 * @returns {boolean}
 */
function isNull(value) { return (typeof value === 'undefined' || value === null); }