/**
 * Determines if the array has any elements.
 * @returns {boolean}
 */
Object.defineProperty(Array.prototype, 'any', {
    enumerable: false,
    value: function () { return (this.length !== 0); }
});

/**
 * Gets the first element of the array.
 * @returns {any}
 */
Object.defineProperty(Array.prototype, 'first', {
    enumerable: false,
    value: function () { return this.any() ? undefined : this[0]; }
});

/**
 * Gets the first non null element of the array.
 * @returns {any}
 */
Object.defineProperty(Array.prototype, 'firstNonNull', {
    enumerable: false,
    value: function () { return this.filterNull().first(); }
});

/**
 * Gets the last element of the array.
 * @returns {any}
 */
Object.defineProperty(Array.prototype, 'last', {
    enumerable: false,
    value: function () { return this.any() ? this[this.length - 1] : undefined; }
});

/**
 * Returns a new array with no null, undefined or empty elements.
 * @returns {Array}
 */
Object.defineProperty(Array.prototype, 'filterEmpty', {
    enumerable: false,
    value: function () { return this.filter(v => !isEmpty(v)); }
});

/**
 * Returns a new array with no null or undefined elements.
 * @returns {Array}
 */
Object.defineProperty(Array.prototype, 'filterNull', {
    enumerable: false,
    value: function () { return this.filter(v => !isNull(v)); }
});

/**
 * Replaces elements in the array that match a condition
 * @param {Function} condition The condition function that returns truthy if the value must be replaced.
 * @param {any} replacement
 * @returns {Array}
 */
Object.defineProperty(Array.prototype, 'replace', {
    enumerable: false,
    value: function (condition, replacement) {
        this.forEach((item, index) => {
            if (condition(item)) this[index] = replacement;
        });
        return this;
    }
});

/**
 * Gets a portion of the array starting from the first element.
 * @param {Number} amount The amount of elements to take.
 * @returns {Array}
 */
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
        // Query is empty, return all items
        if (isEmpty(query)) return this;

        options = options || {};
        options.keys = keys || ['id'];
        options.threshold = options.threshold || 0.4;
        let fuse = new Fuse(this, options);
        return fuse.search(query).map(r => r.item);
    }
});