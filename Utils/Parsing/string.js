Parser.string = function (value) {
    if (Array.isArray(value)) {
        return value.map(v => this.string(v));
    }

    value = String(value);
    value = value.trim();
    return (value.length == 0) ? null : value;
};