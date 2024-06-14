/**
 * Builds a class name string.
 * @param {any} className
 * @param {any} extras
 * @returns {string}
 */
function toClassName(className, extras) {
    let classNames = [];
    if (isArray(className)) classNames = classNames.concat(className);
    else if (typeof className === 'string') classNames.push(className);

    if (isArray(extras)) classNames = classNames.concat(extras);
    else if (typeof extras === 'string') classNames.push(extras);

    return classNames.filterEmpty().join(' ').trim();
}

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