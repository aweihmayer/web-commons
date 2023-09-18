/**
 * Replaces placeholders in a value.
 * @param {Array|object} replacements
 * @returns {string}
 */
String.prototype.t = function (replacements) {
    replacements = replacements || {};
    if (typeof replacements != 'object' && !Array.isArray(replacements)) { replacements = [replacements]; }
    let value = this;

    // Get all placeholders
    let placeholders = [...this.matchAll(/{.*?}/g)].map(match => match[0].replace(/{|}/g, ''));
    // Determine if the replacements are kept in an array or an object
    let arrayMode = Array.isArray(replacements);
    // Replace placeholders
    for (let p in placeholders) {
        let placeholder = arrayMode ? placeholders[p] : p;
        let replacement = arrayMode ? replacements[placeholder] : replacements.getProp(placeholder);
        if (typeof replacement === 'undefined') { throw new Error('Missing i18n replacement "' + p + '" for "' + this + '"'); }
        value = value.replaceAll('{' + placeholder + '}', replacement);
    }

    return value;
};

/**
 * Picks a plural or singular value then replace placeholders.
 * @param {Array|object} replacements
 * @param {boolean|number|string}
 */
Object.defineProperty(Array.prototype, 't', {
    enumerable: false,
    value: function (replacements, plural) {
        switch (typeof plural) {
            case 'boolean': break;
            case 'number': plural = (plural >= 2); break;
            case 'string':
                plural = parseInt(plural);
                plural = isNaN(plural) ? false : (plural >= 2);
        }

        // Value at index 0 is singular and plural at index 1
        let value = plural ? value[1] : value[0];
        return value.t(replacements);
    }
});

/**
 * Picks a localized and plural or singular value then replaces placeholders
 * @param {Array|object} replacements
 * @param {boolean|number|string}
 * @param {string} key
 */
Object.defineProperty(Object.prototype, 't', {
    enumerable: false,
    value: function (replacements, plural, key) {
        let locale = i18n.locale;
        let value = this;

        if (typeof key !== 'undefined' && this.hasProp(key)) { value = value.getProp(key); }
        if (typeof value === 'object' && value.i18n) { value = value.i18n; }
        if (typeof value === 'object') {
            if (value.hasOwnProperty(locale)) { value = value[locale]; }
            else { throw new Error('The ' + locale + ' value is missing for ' + JSON.stringify(this)); }
        }

        return value.t(replacements, plural);
    }
});

/**
 * The i18n configuration.
 */
const i18n = {
    locale: "en"
};