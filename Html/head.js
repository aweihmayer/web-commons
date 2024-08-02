/**
 * Adds or removes metadata nodes from the head.
 * @param {Array} config
 */
document.head.setMetadata = function (name, attribute, value) {
    if (Array.isArray(name)) {
        name.forEach(meta => this.setMetadata(meta.name, meta.attribute, meta.value));
        return;
    }

    let head = document.getElementsByTagName('head')[0];
    let node = head.querySelector("meta[" + attribute + "='" + name + "']");

    // Metadata already in the DOM
    if (node) {
        // The value is empty. Remove the metadata
        if (isEmpty(value)) head.removeChild(node);
        // The value is not empty. Update the metadata
        else node.setAttribute('content', value);
    // Metadata is not in the DOM and the value is not empty. Add the metadata
    } else if (value != null) {
        let meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        meta.setAttribute('content', value);
        head.appendChild(meta);
    }
};