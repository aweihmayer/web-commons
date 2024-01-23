/**
 * Determines if a value is null or empty.
 * @param {any} value
 * @returns {boolean}
 */
function isEmpty(value) { return (typeof value === 'undefined' || value === null || value === ''); }