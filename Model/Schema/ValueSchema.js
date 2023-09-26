/**
 * Defines how a value will be validated.
 * Using this class is an optional reference. You can just use a generic object.
 */
class ValueSchema {
    constructor(params, secondaryParams) {
        params = params || {};
        secondaryParams = secondaryParams || {};

        this.name = params.name || secondaryParams.name || '';
        this.fill = params.fill || secondaryParams.fill || this.name || '';
        this.label = params.label || secondaryParams.label || '';

        this.type = params.type || secondaryParams.type || 'string';
        this.required = [params.required, secondaryParams.required, false].find(v => (typeof v !== 'undefined'));
        this.min = [params.min, secondaryParams.min, null].find(v => (typeof v !== 'undefined'));
        this.max = [params.max, secondaryParams.max, null].find(v => (typeof v !== 'undefined'));
        this.regex = params.regex || secondaryParams.regex || null;
        this.isEnumerable = [params.isEnumerable, secondaryParams.isEnumerable, false].find(v => (typeof v !== 'undefined'));
        this.isNullable = [params.isNullable, secondaryParams.isNullable, true].find(v => (typeof v !== 'undefined'));
        this.values = params.values || secondaryParams.value || null;
        this.const = params.const || secondaryParams.const || null;
        this.i18n = params.i18n || secondaryParams.i18n || null;
    }
}