/**
 * Parses one or many values into strings.
 * @param {any} v
 * @returns {string|string[]} Trimmed string(s) or null(s) if the string is empty.
 */
Parser.toString = (v) => {
    // Recursivity for arrays
    if (Array.isArray(v)) {
        for (let i in v) { v[i] = Parser.toString(v[i]); }
        return v;
    }

    // Trims the string and returns null if it is empty
    v = String(v);
    v = v.trim();
    return (v.length == 0) ? null : v;
};

/**
 * Creates a random string of a specified length.
 * @param {number} length
 * @returns {string}
 */
String.random = (length) => {
    length = length || 25;
    let result = [];
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        let position = Math.floor(Math.random() * charactersLength);
        result.push(characters.charAt(position));
    }
    return result.join('');
}

/**
 * Transforms markdown text to HTML.
 * @param {boolean} decreaseHeadings
 * @returns {string}
 */
String.markdownToHtml = (decreaseHeadings) => {
    let html = markdown(this);
    if (!decreaseHeadings) { return html; }

    for (let i = 7; i > 0; i--) {
        html = html.replaceAll('<h' + (i - 1) + '>', '<h' + i + '>');
        html = html.replaceAll('</h' + (i - 1) + '>', '</h' + i + '>');
    }
    return html;
};

/**
 * Determines if a string is an int.
 * @returns {string}
 */
String.prototype.isInt = () => {
    return /^-?\d+$/.test(this.trim());
};

/**
 * Removes accents from a string.
 * @returns {string}
 */
String.prototype.removeAccents = () => {
    const normalizedString = input.normalize('NFD');
    // Use a regular expression to match and replace diacritics
    const accentRegex = /[\u0300-\u036f]/g;
    // Replace diacritics with an empty string
    const cleanedString = normalizedString.replace(accentRegex, '');
    // Normalize the string back to composed form (NFC)
    return cleanedString.normalize('NFC');
};

/**
 * Transforms a string to a slug.
 * @returns {string}
 */
String.prototype.toSlug = () => {
    let v = this.removeAccepts().toLowerCase().trim();
    v = v.replace(/[^a-z0-9\s-]/, ''); // Invalid chars
    v = v.replace(/\s+/, ''); // Convert multiple spaces into one space
    v = v.replace(/\s/, ''); // Hyphens
    return v;
};