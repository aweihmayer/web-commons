Parser.bool = function (value) {
    if (Array.isArray(value)) return value.map(v => this.bool(v));
    else if (value === null) return false;

    switch (typeof value) {
        case 'boolean': return value;
        case 'number': return (value > 0);
        case 'undefined': return false;
        case 'string':
            value = value.trim().toLowerCase();
            if (value === '') return false;
            else if (['true', 'yes', '1'].includes(value)) return true;
            else if (['false', 'no', '0'].includes(value)) return false;
            value = Number(value);
            if (isNaN(value)) throw new Error('type');
            else return (value > 0);
        default: throw new Error('type');
    }
};