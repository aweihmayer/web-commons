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
        this.default = [params.default, secondary.default, null].findNotEmpty();
        this.isRequired = [params.isRequired, secondary.isRequired, false].findNotEmpty();
        this.min = [params.min, secondary.min, null].findNotEmpty();
        this.max = [params.max, secondary.max, null].findNotEmpty();
        this.regex = params.regex || secondary.regex || null;
        this.isEnumerable = [params.isEnumerable, secondary.isEnumerable, false].findNotEmpty();
        this.isNullable = [params.isNullable, secondary.isNullable, true].findNotEmpty();
        this.values = secondary.values || params.values || null;
        this.const = params.const || secondary.const || null;
        this.i18n = params.i18n || secondary.i18n || null;
    }
}