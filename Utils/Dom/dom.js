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
 * Adds or removes metadata nodes from the head.
 * @param {Array} config
 */
document.head.applyMetadata = (config) => {
    let head = document.getElementsByTagName('head')[0];
    for (let metadata of config) {
        // Get the metadata node
        let node = head.querySelector("meta[" + metadata.attribute + "='" + metadata.name + "']");

        // Metadata already in the DOM
        if (node) {
            // The value is empty. Remove the metadata
            if (metadata.value == null) { head.removeChild(node); }
            // The value is not empty. Update the metadata
            else { node.setAttribute('content', metadata.value); }
            // Metadata is not in the DOM and the value is not empty. Add the metadata
        } else if (metadata.value != null) {
            let meta = document.createElement('meta');
            meta.setAttribute(metadata.attribute, metadata.name);
            meta.setAttribute('content', metadata.value);
            head.appendChild(meta);
        }
    }
};

/**
 * Shows an element by removing the hidden class.
 */
Element.prototype.show = ()  => {
    this.classList.remove('hidden');
};

/**
 * Hides an element by adding the hidden class.
 */
Element.prototype.hide = () => {
    this.classList.add('hidden');
};

/**
 * Determines if an element is visible by checking if it has the hidden class or if it is contained by an element who does.
 * @returns {boolean}
 */
Element.prototype.isVisible = () => (this.closest('.hidden') == null);

/**
 * Builds a class name string from varying types.
 * @param {string|Array} className
 * @param {string|Array} extras
 * @returns {string}
 */
document.buildClassName = (className, extras) => {
    let classNames = [];
    if (Array.isArray(className)) { classNames = classNames.concat(className); }
    else if (typeof className === 'string') { classNames.push(className); }

    if (Array.isArray(extras)) { classNames = classNames.concat(extras); }
    else if (typeof extras === 'string') { classNames.push(extras); }

    return classNames.filter(c => (c != null && c != '')).join(' ').trim();
}