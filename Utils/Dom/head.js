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
            if (metadata.value == null) head.removeChild(node);
            // The value is not empty. Update the metadata
            else node.setAttribute('content', metadata.value);
        // Metadata is not in the DOM and the value is not empty. Add the metadata
        } else if (metadata.value != null) {
            let meta = document.createElement('meta');
            meta.setAttribute(metadata.attribute, metadata.name);
            meta.setAttribute('content', metadata.value);
            head.appendChild(meta);
        }
    }
};