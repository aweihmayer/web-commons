const Parser = {
    /**
     * Parses a value
     * @param {any} value
     * @param {string} type
     */
    parse: function (value, type) {
        if (typeof this[type] === 'function') {
            return this[type](value);
        }

        console.warn('You must define how to parse the type ' + type);
        return value;
    }
};