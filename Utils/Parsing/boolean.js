Parser.bool = function (value) {
    if (Array.isArray(value)) {
        return value.map(v => this.bool(v));
    }

    if (value === null) { return false; }

    switch (typeof value) {
        case 'boolean':
            return value;
        case 'number':
            return (value > 0);
        case 'string':
            value = value.trim().toLowerCase();
            if (value === '') { return false; }
            if (['true', 'yes', '1'].includes(value)) { return true; }
            if (['false', 'no', '0'].includes(value)) { return false; }
            value = Number(value);
            if (isNaN(value)) { throw new Error('type'); }
            return (value > 0);
        case 'undefined':
            return false;
        default:
            throw new Error('type');
    }
};