// #region Properties

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
        let obj = this;
        path.split('.').forEach(k => {
            // The child property exists, keep going
            if (obj.hasOwnProperty(k)) obj = obj[k];
            // The child property does not exist, throw an error
            else throw new Error('The property "' + k + '" of the path "' + path + '" is undefined');
        });

        return obj;
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
        let obj = this;

        // Navigate to the property while creating the object along the way
        for (let i = 0; i < path.length - 1; i++) {
            let k = path[i];
            if (!obj.hasOwnProperty(k)) obj[k] = {};
            obj = obj[k];
        }

        // The last part of the path is the property
        const key = path.last();
        // It contains square brackets and is an array
        if (key.includes('[]')) {
            if (!obj.hasOwnProperty(key)) obj[key] = [];
            if (typeof value !== 'undefined') obj[key].push(value);
        // It is another value
        } else {
            obj[key] = value;
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
        if (!this.hasProp(path)) return;
        let obj = this;
        path.split('.').forEach((k, i, arr) => {
            if (i === arr.length - 1) delete obj[k];
            else obj = obj[k];
        });
    }
});

// #endregion

// #region Transformation

/**
 * Clones the object. Useful to remove references.
 * @param {object} obj
 * @returns {object}
 */
Object.clone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Transforms a query string to an object.
 * @param {string} query
 * @returns {object}
 */
Object.fromQueryString = (query) => {
    let params = {};
    query = query.substring(query.indexOf('?'));
    let queryParams = new URLSearchParams(query);
    for (let pair of queryParams.entries()) params[pair[0]] = pair[1];
    return params;
};

/**
 * Transforms an object to a query string.
 * @param {object} obj
 * @returns {string}
 */
Object.toQueryString = (obj) => {
    if (isEmpty(obj)) return '';
    let query = new URLSearchParams(obj).toString();
    return '?' + query;
};

/**
 * Transforms an object to an array of each property's value.
 * @param {object} obj
 * @returns {Array}
 */
Object.toArray = (obj) => {
    if (Array.isArray(obj)) return obj;
    else return Object.keys(obj).map(k => obj[k]);
};

 // #endregion