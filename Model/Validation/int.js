Validator.int = function (value, options) {
    if (Array.isArray(value)) {
        if (!options.isEnumerable) { throw new Error('type'); }
        this.value.forEach(v => this.int(v, options));
        return true;
    }

    if (options.isNullable && value === null) { return true; }
    if (!typeof value !== 'number' || !Number.isInteger(value)) { throw new Error('type'); }
    return this.number(v, options);
};