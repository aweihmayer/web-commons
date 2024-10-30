Validator.int = function (value, options) {
    if (Array.isArray(value)) {
        if (!isNull(options) && !options.isEnumerable) throw new Error('type');
        value.forEach(v => this.int(v, options));
        return true;
    }

    if (!isNull(options) && options.isNullable && value === null) return true;
    else if (typeof value !== 'number' || !Number.isInteger(value)) throw new Error('type');
    else if (typeof options.min === 'number' && value < options.min) throw new Error('min');
    else if (typeof options.max === 'number' && value > options.max) throw new Error('max');
    else return true;
};