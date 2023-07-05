/**
 * Determines if an object has a property with a JSON path.
 * @param {string} path
 * @returns {boolean}
 */
Object.defineProperty(Object.prototype, 'hasProp', {
    enumerable: false,
    value: function (path) {
        try {
            this.getProp(path);
            return true;
        } catch (ex) {
            return false;
        }
    }
});

/**
 * Gets an object property with a JSON path.
 * @param {string} path
 * @returns {any}
 */
Object.defineProperty(Object.prototype, 'getProp', {
    enumerable: false,
    value: function (path) {
        path = path.split('.');
        let v = this;

        // Navigate to the property
        for (let part of path) {
            // The child property exists, keep going
            if (v.hasOwnProperty(part)) {
                v = v[part];
            // The child property does not exist, throw an error
            } else {
                throw new Error('The property "' + part + '" of the path "' + path + '" is undefined');
            }
        }

        return v;
    }
});

/**
 * Sets an object property with a JSON path.
 * @param {string} path
 * @param {any} value
 */
Object.defineProperty(Object.prototype, 'setProp', {
    enumerable: false,
    value: function (path, value) {
        path = path.split('.');
        let prop = this;

        // Navigate to the property while creating the object along the way
        for (let i = 0; i < path.length - 1; i++) {
            let part = path[i];
            if (!prop.hasOwnProperty(part)) { prop[part] = {}; }
            prop = prop[part];
        }

        // The last part of the path is the property
        path = path.last();
        // It contains square brackets and is an array
        if (path.includes('[]')) {
            if (!prop.hasOwnProperty(path)) { prop[path] = []; }
            prop[path].push(value);
        // It is another value
        } else {
            prop[path] = value;
        }
    }
});

/**
 * Deletes an object property with a JSON path.
 * @param {string} path
 */
Object.defineProperty(Object.prototype, 'deleteProp', {
    enumerable: false,
    value: function (path) {
        path = path.split('.');
        let prop = this;

        // Navigate to the property
        for (let i = 0; i < path.length - 1; i++) {
            let part = path[i];
            if (!prop.hasOwnProperty(part)) { return; }
            prop = prop[part];
        }

        delete prop[path.last()];
    }
});

/**
 * Transform an object to a query string.
 * @returns {string}
 */
Object.defineProperty(Object.prototype, 'toQueryString', {
    enumerable: false,
    value: function () {
        if (Object.keys(this).length === 0) { return ''; }
        let query = new URLSearchParams(this).toString();
        return '?' + query;
    }
});

/**
 * Determines if an object's properties are equal to another's.
 * @param {object} query
 * @returns {boolean}
 */
Object.defineProperty(Object.prototype, 'equals', {
    enumerable: false,
    value: function (query) {
        for (let k in query) {
            if (typeof query[k] !== typeof this[k]) { return false; }
            if (typeof this[k] == 'function') { continue; }
            if (!this.hasOwnProperty(k)) { return false; }
            if (typeof this[k] === 'object') {
                if (!this[k].equals(query[k])) { return false; }
            } else if (query[k] !== this[k]) {
                return false;
            }
        }

        return true;
    }
});

/**
 * Removes empty properties.
 */
Object.defineProperty(Object.prototype, 'deleteEmptyProps', {
    enumerable: false,
    value: function () {
        let keys = Object.keys(this);
        for (let k of keys) {
            if (this[k] === null
            || (typeof this[k] === 'string' && this[k].trim() === '')) {
                delete this[k];
            } else if (typeof this[k] === 'object') {
                this.deleteEmptyProps();
            }
        }
    }
});

/**
 * Clones the object to remove references.
 * @returns {object}
 */
Object.defineProperty(Object.prototype, 'cloneObject', {
    enumerable: false,
    value: function () {
        return JSON.parse(JSON.stringify(this));
    }
});
