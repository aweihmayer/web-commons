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
        return this.filter(v => (v !== null && v !== ''));
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

