﻿Parser.int = function (value) {
    if (Array.isArray(value)) {
        return value.map(v => this.int(v));
    }

    switch (typeof value) {
        case 'boolean':
            return value ? 1 : 0;
        case 'number':
            return parseInt(value);
        case 'string':
            value = value.trim();
            if (value == '') { return null; }
            value = parseInt(value);
            if (isNaN(value)) { throw new Error('type'); }
            return value;
        default:
            throw new Error('type');
    }
};