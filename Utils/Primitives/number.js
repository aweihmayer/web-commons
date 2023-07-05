/**
 * Parses one or many values into integers.
 * @param {any} v
 * @throws {Error} If the value could not be parsed.
 * @returns {number|number[]} Integer(s) or null(s) if the value is empty.
 */
Number.parseInt2 = function (v) {
    // Recursivity for arrays
    if (Array.isArray(v)) {
        for (let i in v) { v[i] = Number.parseInt2(v[i]); }
        return v;
    }

    switch (typeof v) {
        case 'number': return parseInt(v);
        case 'string':
            v = v.trim();
            if (v == '') { return null; }
            v = parseInt(v);
            if (isNaN(v)) { throw new Error('type'); }
            return v;
        default:
            if (v === null) { return null; }
            throw new Error('type');
    }
};