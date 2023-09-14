/**
 * Defines how a value will be validated.
 * Using this class is an optional reference. You can just use a generic object.
 */
class ValueSchema {
    constructor(params) {
        this.name = params.name || '';
        this.type = params.type || 'string';
        this.required = params.required || false;
        this.min = (typeof params.min == 'undefined') ? null : params.min;
        this.max = (typeof params.max == 'undefined') ? null : params.max;
        this.regex = params.regex || null;
        this.options = params.options || null;
    }
}