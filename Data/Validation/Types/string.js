Validator.string = function (value, options) {
    if (Array.isArray(value)) {
        if (!isNull(options) && !options.isEnumerable) throw new Error('type');
        value.forEach(v => this.string(v, options));
        return true;
    }

    if (!isNull(options) && options.isNullable && value === null) return true;
    else if (typeof value !== 'string') throw new Error('type');
    else if (typeof options.min === 'number' && value.length < options.min) throw new Error('min');
    else if (typeof options.max === 'number' && value.length > options.max) throw new Error('max');
    else if (typeof options.regex === 'string' && !new RegExp(options.regex).test(value)) throw new Error('regex');
    else return true;
};