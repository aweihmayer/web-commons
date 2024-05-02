class ValueSchema {
    constructor(props, props2) {
        props = props ?? {};
        props2 = props2 ?? {};

        this.name = props.name || props2.name;
        this.fill = props.fill || props2.fill || this.name;
        this.label = props.label || props2.label || null;
        this.type = props.type || props2.type || 'string';
        this.regex = props.regex || props.regex || null;
        this.isRequired = [props.isRequired, props2.isRequired, false].firstNonNull();
        this.isEnumerable = [props.isEnumerable, props2.isEnumerable, false].firstNonNull();
        this.isNullable = [props.isNullable, props2.isNullable, false].firstNonNull();
        this.min = [props.min, props2.min, null].firstNonNull();
        this.max = [props.max, props2.max, null].firstNonNull();
        this.values = props.values || props2.values || null;
        this.default = props.default || props2.default || null;
        this.i18n = props.i18n || props.i18n || null;
    }

    toOptions() {
        if (!this.values) return [];
        else return this.values.map(v => {
            return {
                name: (this.i18n && this.i18n[v]) ? translate(this.i18n[v]) : v,
                value: v
            }
        });
    }
}