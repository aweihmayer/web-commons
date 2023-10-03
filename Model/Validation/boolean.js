Validator.bool = function (value, options) {
    if (Array.isArray(value)) {
        if (!options.isEnumerable) { throw new Error('type'); }
        value.forEach(v => this.bool(v, options));
        return true;
    }

    if (options.isNullable && value === null) { return true; }
    if (typeof value !== 'boolean') { throw new Error('type'); }
    return true;
}