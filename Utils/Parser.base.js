const Parser = {
    /**
     * Parses a value
     * @param {any} value
     * @param {'bool'|'int'|'number'|'string'} type
     */
    parse: (value, type) => {
        switch (type) {
            case 'int': return Parser.toInt(value);
            case 'number': return Parser.toNumber(value);
            case 'email':
            case 'string': return Parser.toString(value);
            case 'bool': return Parser.toBoolean(value);
            default: throw new Error('type');
        }
    }
};