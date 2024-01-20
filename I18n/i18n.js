function translate(value, replacements, plural, key) {
    // Value is an object, it contains locales and/or keys
    if (typeof value === 'object' && !Array.isArray(value)) {
        // A specific key is defined
        if (typeof key !== 'undefined' && this.hasProp(key)) value = value.getProp(key);
        // The value has an i18n property
        if (typeof value === 'object' && value.i18n) value = value.i18n;

        // The value is an array, translate it
        if (Array.isArray(value)) return translate(value, replacements, plural);
        // The value is not an object, translate it
        else if (typeof value !== 'object') return translate(value, replacements, plural);

        // The value is an object, it has a locale
        let locale = App.state.locale;
        // The locale is found, translate it
        if (value.hasOwnProperty(locale)) return translate(value[locale], replacements, plural);

        // The locale is not found, we translate the first locale by default
        Console.warn('The ' + locale + ' value is missing for ' + JSON.stringify(value));
        let locales = Object.keys(value);
        // There are no locales, return an empty string
        if (!locale.any()) return '';
        // Translate the first locale
        let defaultLocale = locales.first();
        return translate(value[defaultLocale], replacements, plural);
    // The value is an array, it contains singular and plural value
    } else if (Array.isArray(value)) {
        // Determine plurality
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
        return plural ? translate(value[1], replacements) : translate(value[0], replacements);
    // The value is a string, it can contain placeholders that must be replaced
    } else {
        replacements = replacements || {};
        if (typeof replacements !== 'object' && !Array.isArray(replacements)) { replacements = [replacements]; }
        // Get all placeholders
        let placeholders = [...value.matchAll(/{.*?}/g)].map(match => match[0].replace(/{|}/g, ''));
        if (placeholders.length === 0) { return value; }

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
    }
}