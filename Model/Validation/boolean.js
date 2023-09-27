Validator.bool = function (value, options) {
    if (Array.isArray(value)) {
        if (!options.isEnumerable) { throw new Error('type'); }
        this.value.forEach(v => this.bool(v, options));
        return true;
    }

    if (options.isNullable && value === null) { return true; }
    if (typeof v !== 'boolean') { throw new Error('type'); }
    return true;
}