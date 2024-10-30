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
    let code = document.getCode();
    code = parseInt(code);
    return (code < 200 || code > 299);
};