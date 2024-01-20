﻿class CheckboxGroupInput extends BaseInput {
    render() {
        return <InputContainer label={this.schema.label} id={this.id} className={[this.props.className, 'checkbox-input checkbox-group-input']} tooltip={this.props.tooltip} ref="container">
            {null}
        </InputContainer>;
    }

    setValue(values) {
        this.refs.container.querySelectorAll('[name="' + this.props.name + '"]').forEach(inp => {
            input.checked = values.includes(inp.value);
        });
    }

    getRawValue() {
        return this.refs.container.querySelectorAll('input:checked').map(inp => inp.value);
    }

    clearValue() {
        this.refs.container.querySelectorAll('[name="' + this.schema.name + '"]').forEach(inp => {
            inp.checked = false;
        });
    }
}