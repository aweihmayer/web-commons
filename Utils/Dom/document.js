/**
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
 * Builds a class name string from varying types.
 * @param {string|Array} className
 * @param {string|Array} extras
 * @returns {string}
 */
function toClassName(className, extras) {
    let classNames = [];
    if (Array.isArray(className)) { classNames = classNames.concat(className); }
    else if (typeof className === 'string') { classNames.push(className); }

    if (Array.isArray(extras)) { classNames = classNames.concat(extras); }
    else if (typeof extras === 'string') { classNames.push(extras); }

    return classNames.filter(c => (c != null && c != '')).join(' ').trim();
}

document.getCode = () => {
    return parseInt(document.body.dataset.code);
};

document.setCode = (code) => {
    document.body.dataset.code = code;
    document.body.setAttribute('data-code', code);
};

document.hasErrorCode = () => {
    let code = document.body.dataset.code;
    code = parseInt(code);
    return (code < 200 || code > 299);
};