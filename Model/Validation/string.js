Validator.string = function (value, options) {
    if (Array.isArray(value)) {
        if (!options.isEnumerable) { throw new Error('type'); }
        value.forEach(v => this.string(v, options));
        return true;
    }

    if (options.isNullable && value === null) { return true; }
    if (typeof value !== 'string') { throw new Error('type'); }
    if (typeof options.min === 'number' && value.length < options.min) {
        throw new Error('min');
    }
    if (typeof options.max === 'number' && value.length > options.max) {
        throw new Error('max');
    }
    if (typeof options.regex === 'string') {
        let regex = new RegExp(options.regex);
        if (!regex.test(value)) { throw new Error('regex'); }
    }
    return true;
};