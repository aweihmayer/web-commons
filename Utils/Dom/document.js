﻿/**
 * Create a unique id that doesn't already exist in the document.
 * @param {any} id
 * @returns {string}
 */
document.createUniqueId = (id) => {
    let newId = id;
    let count = 0;
    while (document.getElementById(newId)) {
        count++;
        newId = id + '-' + count;
    }

    return newId;
};

/**
 * Builds a class name string.
 * @param {any} className
 * @param {any} extras
 * @returns {string}
 */
function toClassName(className, extras) {
    let classNames = [];
    if (Array.isArray(className)) classNames = classNames.concat(className);
    else if (typeof className === 'string') classNames.push(className);

    if (Array.isArray(extras)) classNames = classNames.concat(extras);
    else if (typeof extras === 'string') classNames.push(extras);

    return classNames.filterEmpty().join(' ').trim();
}

/**
 * Gets the HTTP code attribute on the body element.
 * @returns {number}
 */
document.getCode = function () {
    if (!this.body.dataset.code) return 200;
    else return parseInt(this.body.dataset.code);
};

/**
 * Sets the HTTP code attribute on the body element.
 */
document.setCode = function (code) {
    this.body.dataset.code = code;
    this.body.setAttribute('data-code', code);
};

/**
 * Determines if the HTTP code attribute on the body element is an error code.
 * @returns {boolean}
 */
document.hasErrorCode = function () {
    let code = this.body.dataset.code;
    code = parseInt(code);
    return (code < 200 || code > 299);
};