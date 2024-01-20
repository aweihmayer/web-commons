class CheckboxInput extends BaseInput {
    render() {
        return <InputContainer label={this.schema.label} id={this.id} className={[this.props.className, 'checkbox-input checkbox-single-input one-line']} tooltip={this.props.tooltip} ref="container">
            <div className="input-wrapper">
                <input ref="input"
                    id={this.id}
                    name={this.schema.name}
                    type="checkbox"
                    onChange={ev => this.handleChange(ev)} />
            </div>
        </InputContainer>;
    }

    setValue(value) {
        try {
            let isChecked = Parser.bool(value);
            this.refs.input.checked = isChecked;
        } catch { }
    }

    getRawValue() {
        return this.refs.input.checked;
    }
}