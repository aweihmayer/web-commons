class TextInput extends InputContainer {
    constructor(props) {
        props.autocomplete = props.autocomplete || 'on';
        props.inputClassName = document.buildClassName(props.inputClassName, 'text-input');
        props.textInputType = props.textInputType || 'text';
        super(props);
    }

    render() {
        return super.render(<div className="input-wrapper">
            <input ref="input"
                type={this.props.textInputType} 
                name={this.props.name}
                defaultValue={this.props.value}
                id={this.props.inputId}
                placeholder={this.props.placeholder}
                onFocus={this.clearError.bind(this)}
                onKeyPress={this.handleKeyPress.bind(this)}
                onBlur={this.isValid.bind(this)}
                onInput={this.props.onInput}
                maxLength={this.state.schema.max}
                autoComplete={this.autocomplete}
                tabIndex={this.props.tabIndex} />
        </div>);
    }
}