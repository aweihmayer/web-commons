const Parser = {
    /**
     * Parses a value
     * @param {any} value
     * @param {string} type
     */
    parse: function (value, type) {
        if (typeof this[type] !== 'function') { throw new Error('You must define how to parse the type ' + type); }
        return this[type](value);
    }
};