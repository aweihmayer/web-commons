class TextInput extends BaseInput {
    static defaultProps = {
        autocomplete: 'on',
        textType: 'text'
    }

    render() {
        return <InputContainer label={this.schema.label} id={this.id} className={[this.props.className, 'text-input']} tooltip={this.props.tooltip} ref="container">
            <div className="input-wrapper">
                <input ref="input"
                    autoComplete={this.props.autocomplete}
                    defaultValue={this.schema.default}
                    id={this.id}
                    maxLength={this.schema.max}
                    name={this.schema.name}
                    placeholder={this.props.placeholder}
                    onBlur={ev => this.handleBlur(ev)}
                    onFocus={ev => this.handleFocus(ev)}
                    onInput={ev => this.handleInput(ev)}
                    onKeyPress={ev => this.handleKeyPress(ev)}
                    tabIndex={this.props.tabIndex}
                    type={this.props.textType} />
            </div>
        </InputContainer>;
    }
}