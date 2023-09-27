Parser.string = function (v) {
    // Recursivity for arrays
    if (Array.isArray(v)) {
        for (let i in v) { v[i] = this.string(v[i]); }
        return v;
    }

    // Trims the string and returns null if it is empty
    v = String(v);
    v = v.trim();
    return (v.length == 0) ? null : v;
};