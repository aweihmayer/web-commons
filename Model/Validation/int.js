Validator.int = function (value, options) {
    if (Array.isArray(value)) {
        if (!options.isEnumerable) { throw new Error('type'); }
        this.value.forEach(v => this.int(v, options));
        return true;
    }

    if (options.isNullable && value === null) { return true; }
    if (typeof value !== 'number' || !Number.isInteger(value)) { throw new Error('type'); }
    if (typeof options.min === 'number' && value < options.min) {
        throw new Error('min');
    }
    if (typeof options.max === 'number' && value > options.max) {
        throw new Error('max');
    }
    return true;
};