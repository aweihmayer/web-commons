Parser.number = function (value) {
    if (Array.isArray(value)) {
        return value.map(v => this.number(v));
    }

    v = Number(v);
    if (isNaN(v)) { throw new Error('type'); }
    return v;
}