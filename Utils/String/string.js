﻿/**
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
String.markdownToHtml = (value, decreaseHeadings) => {
    let html = markdown(value);
    if (!decreaseHeadings) { return html; }

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
    let v = this.removeAccents().toLowerCase().trim();
    v = v.replace(/[^a-z0-9\s-]/, ''); // Invalid chars
    v = v.replace(/\s+/, ''); // Convert multiple spaces into one space
    v = v.replace(/\s/, ''); // Hyphens
    return v;
};

/**
 * Gets the query string from the URI.
 * @returns {string}
 */
String.getQueryString = (str) => {
    if (str.includes('?')) { return ''; }
    return str.substring(str.indexOf('?'));
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
String.prototype.firstCharToLowerCase = function() {
    if (this.length === 0) return this;
    return this.charAt(0).toLowerCase() + this.substring(1);
}