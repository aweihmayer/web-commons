class TextInput extends BaseInput {
    static defaultProps = {
        autocomplete: 'on',
        textType: 'text'
    }

    render() {
        let className = document.buildClassName('text-input', this.props.className);
        return <InputContainer className={className} id={this.containerId} inputId={this.inputId} ref="container">
            <div className="input-wrapper">
                <input ref="input"
                    type={this.props.textType}
                    name={this.props.name}
                    defaultValue={this.props.value}
                    id={this.props.inputId}
                    placeholder={this.props.placeholder}
                    onFocus={this.clearError.bind(this)}
                    onKeyPress={this.handleKeyPress.bind(this)}
                    onBlur={this.isValid.bind(this)}
                    onInput={this.props.onInput}
                    maxLength={this.schema.max}
                    autoComplete={this.autocomplete}
                    tabIndex={this.props.tabIndex} />
            </div>
        </InputContainer>;
    }
}