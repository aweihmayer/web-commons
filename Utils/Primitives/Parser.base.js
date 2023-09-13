const Parser = {
    /**
     * Parses a value
     * @param {any} value
     * @param {'bool'|'int'|'number'|'string'} type
     */
    parse: (value, type) => {
        switch (type) {
            case 'int': return Parser.toInt(v);
            case 'number': return Parser.toNumber(v);
            case 'email':
            case 'string': return Parser.toString(v);
            case 'bool': return Parser.toBoolean(v);
            default: throw new Error('type');
        }
    }
};