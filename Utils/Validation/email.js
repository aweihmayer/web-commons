Validator.email = function (value, options) {
    if (Array.isArray(value)) {
        if (!options.isEnumerable) throw new Error('type');
        value.forEach(v => this.email(v, options));
        return true;
    }

    if (options.isNullable && value === null) return true;
    else if (typeof value !== 'string') throw new Error('type');
    else if (value.length < 5) throw new Error('min');
    else if (value.length > 255) throw new Error('max');
    else if (!new RegExp("^.*@.*\\..*$").test(value)) throw new Error('regex');
    else return true;
}