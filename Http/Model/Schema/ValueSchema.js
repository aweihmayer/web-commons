/**
 * Defines how a value will be validated.
 */
class ValueSchema {
    constructor(params, secondary) {
        params = params || {};
        secondary = secondary || {};

        this.name = params.name || secondary.name || '';
        this.fill = params.fill || secondary.fill || this.name || '';
        this.label = params.label || secondary.label || '';
        this.type = params.type || secondary.type || 'string';
        this.default = [params.default, secondary.default, null].find(v => (typeof v !== 'undefined'));
        this.isRequired = [params.isRequired, secondary.isRequired, false].find(v => (typeof v !== 'undefined'));
        this.min = [params.min, secondary.min, null].find(v => (typeof v !== 'undefined'));
        this.max = [params.max, secondary.max, null].find(v => (typeof v !== 'undefined'));
        this.regex = params.regex || secondary.regex || null;
        this.isEnumerable = [params.isEnumerable, secondary.isEnumerable, false].find(v => (typeof v !== 'undefined'));
        this.isNullable = [params.isNullable, secondary.isNullable, true].find(v => (typeof v !== 'undefined'));
        this.values = secondary.values || params.values || null;
        this.const = params.const || secondary.const || null;
        this.i18n = params.i18n || secondary.i18n || null;
    }
}