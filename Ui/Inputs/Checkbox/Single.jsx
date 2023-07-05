class CheckboxInput extends InputContainer {
    constructor(props) {
        props.type = props.type || 'bool';
        super(props);
        this.inputClassName = 'checkbox-input checkbox-single-input';
    }

    render() {
        return super.render(<Checkbox ref="input"
            isChecked={false}
            value={this.props.value}
            name={this.name}
            id={this.inputId} />);
    }

    fill(v) {
        if (v == true || v == 1) {
            this.refs.input.refs.checkbox.checked = true;
        } else {
            this.refs.input.refs.checkbox.checked = false;
        }
    }

    raw() {
        let checkbox = this.refs.input.refs.checkbox;
        if (checkbox.checked) {
            return checkbox.value ? checkbox.value : true;
        } else {
            return checkbox.value ? null : false;
        }
    }

    isDisabled() {
        if (this.refs.input.refs.checkbox.closest('*[disabled]')) { return true; }
        return false;
    }
}