﻿class SelectInput extends BaseInput {
    render() {
        return <InputContainer label={this.schema.label} id={this.id} className={[this.props.className, 'select-input']} tooltip={this.props.tooltip} ref="container">
            <div className="input-wrapper">
                <select ref="input"
                    defaultValue={this.props.value}
                    id={this.id}
                    name={this.schema.name}
                    onChange={ev => this.handleChange(ev)}
                    onFocus={ev => this.handleFocus(ev)}>
                    {this.schema.values.map((v, i) =>
                        <option key={v} value={v}>{translate(this.schema.i18n[v], v)}</option>
                    )}
                </select>
            </div>
        </InputContainer>;
    }

    setValue(value) {
        try {
            let parsedValue = Parser.parse(value, this.schema.type);
            Array.from(this.refs.input.getElementsByTagName('option')).forEach(o => {
                if (Parser.parse(o.value, this.schema.type) === parsedValue) {
                    o.selected = true;
                    return;
                }
            });
        } catch { }
    }
}