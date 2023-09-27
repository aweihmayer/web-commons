Validator.email = function (value, options) {
    if (Array.isArray(value)) {
        if (!options.isEnumerable) { throw new Error('type'); }
        this.value.forEach(v => this.email(v, options));
        return true;
    }

    if (options.isNullable && value === null) { return true; }
    if (typeof value !== 'string') { throw new Error('type'); }
    if (value.length < 5) { throw new Error('min'); }
    if (value.length > 255) { throw new Error('max'); }
    let regex = new RegExp("^.*@.*\\..*$");
    if (!regex.test(value)) { throw new Error('regex'); }
    return true;
}