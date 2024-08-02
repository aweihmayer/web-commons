/**
 * Creates a random string of a specified length.
 * @param {number} length The length of the string. Defaults to 25.
 * @returns {string}
 */
String.random = (length = 25) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        let position = Math.floor(Math.random() * characters.length);
        result += characters.charAt(position);
    }
    return result;
};

/**
 * Transforms markdown text to HTML.
 * @param {boolean} decreaseHeadings Decreases the heading values by one if true.
 * @returns {string}
 */
String.markdownToHtml = (value, decreaseHeadings) => {
    let html = markdown(value);
    if (!decreaseHeadings) return html;

    for (let i = 7; i > 0; i--) {
        html = html.replaceAll('<h' + (i - 1) + '>', '<h' + i + '>');
        html = html.replaceAll('</h' + (i - 1) + '>', '</h' + i + '>');
    }
    return html;
};

/**
 * Removes accents from a string.
 * @returns {string}
 */
String.prototype.removeAccents = function() {
    const normalizedString = this.normalize('NFD');
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
String.prototype.toSlug = function() {
    return this.removeAccents().toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/, '') // Invalid chars
        .replace(/\s+/, ' ') // Convert multiple spaces into one space
        .replace(/\s/, '-'); // Hyphens
};

/**
 * Gets the query string from the URI.
 * @returns {string}
 */
String.getQueryString = (str) => {
    if (!str.includes('?')) return '';
    else return str.substring(str.indexOf('?'));
};

/**
* Removes the query string from the URI.
* @returns {string}
*/
String.removeQueryString = (str) => str.split('?')[0];

/**
 * Transforms the first char of a string to lower case.
 * @returns {string}
 */
String.prototype.firstCharToLowerCase = function () {
    if (this.length === 0) return this;
    else return this.charAt(0).toLowerCase() + this.substring(1);
};