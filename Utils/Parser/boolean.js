Parser.bool = function (value) {
    if (Array.isArray(value)) {
        return value.map(v => this.bool(v));
    }

    switch (typeof value) {
        case 'boolean':
            return value;
        case 'number':
            return (value > 0);
        case 'string':
            v = v.trim().toLowerCase();
            if (v === '') { return null; }
            if (['true', 'yes', '1'].includes(v)) { return true; }
            if (['false', 'no', '0'].includes(v)) { return false; }
            v = Number(v);
            if (isNaN(v)) { throw new Error('type'); }
            return (value > 0);
        default:
            throw new Error('type');
    }
};