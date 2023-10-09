/**
 * Replaces placeholders in a value.
 * @param {Array|object} replacements
 * @returns {string}
 */
String.prototype.t = function (replacements) {
    replacements = replacements || {};
    let value = this;
    let placeholders = [...value.matchAll(/{.*?}/g)].map(match => match[0].replace(/{|}/g, ''));
    if (placeholders.length === 0) { return value; }
    if (typeof replacements !== 'object' && !Array.isArray(replacements)) { replacements = [replacements]; }

    // Replace with array
    if (Array.isArray(replacements)) {
        if (placeholders.length > replacements.length) {
            console.error('Missing i18n replacements for ' + value);
        }

        replacements.forEach((r, i) => {
            value = value.replaceAll('{' + i + '}', r);
        });

        return value;
        // Replace with object
    } else {
        placeholders.forEach(p => {
            let r = replacements.getProp(p);
            if (typeof r === 'undefined' || r === null) {
                console.error('Missing i18n replacement ' + p + ' for ' + value);
                return;
            }
            value = value.replaceAll('{' + p + '}', r);
        });

        return value;
    }
};

/**
 * Picks a plural or singular value.a
 * @param {Array|object} replacements
 * @param {boolean|number|string}
 */
Object.defineProperty(Array.prototype, 't', {
    enumerable: false,
    value: function (replacements, plural) {
        // Parse the plurality
        switch (typeof plural) {
            case 'boolean':
                break;
            case 'number':
                plural = (plural >= 2);
                break;
            case 'string':
                plural = parseInt(plural);
                plural = isNaN(plural) ? false : (plural >= 2);
                break;
        }

        // Value at index 0 is singular and plural at index 1
        let value = plural ? this[1] : this[0];
        return value.t(replacements);
    }
});

/**
 * Picks a localized value.
 * @param {Array|object} replacements
 * @param {boolean|number|string}
 * @param {string} key
 */
Object.defineProperty(Object.prototype, 't', {
    enumerable: false,
    value: function (replacements, plural, key) {
        let value = this;
        // A specific key is defined
        if (typeof key !== 'undefined' && this.hasProp(key)) { value = value.getProp(key); }
        // The value has an i18n property
        if (typeof value === 'object' && value.i18n) { value = value.i18n; }
        // The value is an array, it is valid
        if (Array.isArray(value)) { return value.t(replacements, plural); }
        // The value is not an object, it is valid
        if (typeof value !== 'object') { return value.t(replacements, plural); }
        // The value is an object, it must have a property equal to the locale
        let locale = App.state.locale;
        if (value.hasOwnProperty(locale)) { return value[locale].t(replacements, plural); }
        throw new Error('The ' + locale + ' value is missing for ' + JSON.stringify(value));
    }
});