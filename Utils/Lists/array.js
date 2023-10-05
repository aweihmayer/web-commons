/**
 * Determines if the array has any elements
 * @returns {boolean}
 */
Object.defineProperty(Array.prototype, 'any', {
    enumerable: false,
    value: function () {
        return (this.length !== 0);
    }
});

/**
 * Gets the first element of the array.
 * @returns {any}
 */
Object.defineProperty(Array.prototype, 'first', {
    enumerable: false,
    value: function () {
        return (this.length === 0) ? undefined : this[0];
    }
});

/**
 * Gets the last element of the array.
 * @returns {any}
 */
Object.defineProperty(Array.prototype, 'last', {
    enumerable: false,
    value: function () {
        return (this.length === 0) ? null : this[this.length - 1];
    }
});

/**
 * Determines if the array has any values.
 * @returns {boolean}
 */
Object.defineProperty(Array.prototype, 'isEmpty', {
    enumerable: false,
    value: function () {
        return (this.length === 0);
    }
});

/**
 * Returns a new array with no null or empty string values.
 * @returns {Array}
 */
Object.defineProperty(Array.prototype, 'filterEmpty', {
    enumerable: false,
    value: function () {
        return this.filter(v => (v !== null && v !== '' && typeof v !== 'undefined'));
    }
});

Object.defineProperty(Array.prototype, 'replace', {
    enumerable: false,
    value: function (func, replacement) {
        let indexes = this.map((item, index) => func(item) ? index : -1).filter(index => index !== -1);
        for (let i of indexes) {
            this[i] = replacement;
        }
        return this;
    }
});

Object.defineProperty(Array.prototype, 'take', {
    enumerable: false,
    value: function (amount) {
        return this.slice(0, amount);
    }
});

/**
 * Gets items that match a fuzzy search query.
 * @param {string} query
 * @param {Array<string>} keys
 * @param {object} [options] Fuse JS options https://fusejs.io/api/options.html.
 */
Object.defineProperty(Array.prototype, 'fuzzySearch', {
    enumerable: false,
    value: function (query, keys, options) {
        query = query || '';
        // Query is empty, return all items
        if (query == '') { return this; }

        options = options || {};
        options.keys = keys || ['id'];
        options.threshold = options.threshold || 0.4;
        let fuse = new Fuse(this, options);
        return fuse.search(query).map(r => r.item);
    }
});