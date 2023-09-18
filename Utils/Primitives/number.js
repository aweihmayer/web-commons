/**
 * Parses one or many values into integers.
 * @param {any} v
 * @throws {Error} If the value could not be parsed.
 * @returns {number|number[]} Integer(s) or null(s) if the value is empty.
 */
Parser.int = function (v) {
    // Recursivity for arrays
    if (Array.isArray(v)) {
        for (let i in v) { v[i] = Parser.toInt(v[i]); }
        return v;
    }

    switch (typeof v) {
        case 'boolean': return v ? 1 : 0;
        case 'number': return parseInt(v);
        case 'string':
            v = v.trim();
            if (v == '') { return null; }
            v = parseInt(v);
            if (isNaN(v)) { throw new Error('type'); }
            return v;
        default:
            throw new Error('type');
    }
};

/**
 * Parses one or many values into numbers.
 * @param {any} v
 * @throws {Error} If the value could not be parsed.
 * @returns {number|number[]} Integer(s) or null(s) if the value is empty.
 */
Parser.number = function (v) {
    // Recursivity for arrays
    if (Array.isArray(v)) {
        for (let i in v) { v[i] = this.number(v[i]); }
        return v;
    }

    v = Number(v);
    if (isNaN(v)) { throw new Error('type'); }
    return v;
}