Validator.required = function (value, options) {
    if (Array.isArray(value)) {
        if (!isNull(options) && !options.isEnumerable) throw new Error('type');
        else if (value.length === 0) throw new Error('required');
        else return true;
    }

    if (isEmpty(value)) throw new Error('required');
    else return true;
};