﻿Validator.number = function (value, options) {
    if (Array.isArray(value)) {
        if (!options.isEnumerable) throw new Error('type');
        value.forEach(v => this.number(v, options));
        return true;
    }

    if (options.isNullable && value === null) return true;
    else if (typeof value !== 'number') throw new Error('type');
    else if (typeof options.min === 'number' && value < options.min) throw new Error('min');
    else if (typeof options.max === 'number' && value > options.max) throw new Error('max');
    else return true;
};