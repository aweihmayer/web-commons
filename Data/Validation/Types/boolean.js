Validator.bool = function (value, options) {
    if (Array.isArray(value)) {
        if (!isNull(options) && !options.isEnumerable) throw new Error('type');
        value.forEach(v => this.bool(v, options));
        return true;
    }

    if (!isNull(options) && options.isNullable && value === null) return true;
    else if (typeof value !== 'boolean') throw new Error('type');
    else return true;
}