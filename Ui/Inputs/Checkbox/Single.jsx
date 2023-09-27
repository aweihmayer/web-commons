class CheckboxInput extends BaseInput {
    render() {
        return <InputContainer label={this.schema.label} id={this.id} className={[this.props.className, 'checkbox-input checkbox-single-input']} ref="container">
            <div className="input-wrapper">
                <input ref="input"
                    id={this.id}
                    name={this.schema.name}
                    type="checkbox" />
            </div>
        </InputContainer>;
    }

    fill(value) {
        try {
            let isChecked = Parse.bool(value);
            this.refs.input.check = isChecked;
        } catch { }
    }

    raw() {
        return this.refs.input.checked;
    }
}