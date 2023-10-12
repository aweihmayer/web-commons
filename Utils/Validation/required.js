Validator.required = function (value, options) {
    if (Array.isArray(value)) {
        if (!options.isEnumerable) { throw new Error('type'); }
        if (value.length === 0) { throw new Error('required'); }
        return true;
    }

    if (value === null
    || value === ''
    || typeof value === 'undefined') {
        throw new Error('required');
    }
    return true;
};