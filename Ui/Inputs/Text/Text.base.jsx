class TextInput extends InputContainer {
    constructor(props) {
        super(props);
        this.autocomplete = props.autocomplete || 'on';
        this.inputClassName = 'text-input';
        this.textType = 'text';
    }

    render() {
        return super.render(<div className="input-wrapper">
            <input ref="input"
            type={this.textType} 
            name={this.name}
            defaultValue={this.props.value}
            id={this.inputId}
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