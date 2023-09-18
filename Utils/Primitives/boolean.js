/**
 * Parses one or more values into booleans.
 * @param {any} v
 * @throws {Error} If the value could not be parsed.
 * @returns {boolean|boolean[]}
 */
Parser.boolean = function (v) {
    // Recursivity for arrays
    if (Array.isArray(v)) {
        for (let i in v) { v[i] = Parser.toBoolean(v[i]); }
        return v;
    }

    switch (typeof v) {
        case 'boolean': return v;
        case 'number': return (v > 0);
        case 'string':
            v = v.trim().toLowerCase();
            if (['true', 'yes', '1'].includes(v)) { return true; }
            if (['false', 'no', '0'].includes(v)) { return false; }
            v = Number(v);
            if (isNaN(v)) { throw new Error('type'); }
            return Parser.toBoolean(v);
        default: throw new Error('type');
    }
};