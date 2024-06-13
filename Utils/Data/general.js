/**
 * Determines if a value is undefined.
 * @param {any} value
 * @returns {boolean}
 */
function isUndefined(value) {
    return (typeof value === 'undefined');
}

/**
 * Determines if a value is null or undefined.
 * @param {any} value
 * @returns {boolean}
 */
function isNull(value) {
    return (isUndefined(value) || value === null);
}

/**
 * Determines if a value is null, undefined or empty.
 * @param {any} value
 * @returns {boolean}
 */
function isEmpty(value) {
    if (isNonArrayObject(value) && value !== null) return !Object.keys(value).any();
    else if (isArray(value)) return !value.any();
    else return (isNull(value) || value === '');
}

/**
 * Determines if a value is an array.
 * @param {any} value
 * @returns {boolean}
 */
function isArray(value) {
    return Array.isArray(value);
}

/**
 * Determines if a value is an object.
 * @param {any} value
 * @returns {boolean}
 */
function isObject(value) {
    return (typeof value === 'object');
}

/**
 * Determines if a value is an object, but not an array.
 * @param {any} value
 * @returns {boolean}
 */
function isNonArrayObject(value) {
    return isObject(value) && !isArray(value);
}