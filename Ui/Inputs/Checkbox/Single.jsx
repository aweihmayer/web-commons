class CheckboxInput extends BaseInput {
    constructor(props) {
        props.type = props.type || 'bool';
        super(props);
        this.inputClassName = 'checkbox-input checkbox-single-input';
    }

    render() {
        let className = document.buildClassName('text-input', this.props.className);
        return <InputContainer className={className} id={this.containerId} inputId={this.inputId} ref="container"><Checkbox ref="input"
            isChecked={false}
            value={this.props.value}
            name={this.name}
            id={this.inputId} />
        </InputContainer>;
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