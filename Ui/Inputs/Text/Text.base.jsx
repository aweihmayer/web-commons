class TextInput extends BaseInput {
    static defaultProps = {
        autocomplete: 'on',
        textType: 'text'
    }

    render() {
        // TODO is binding always good. Can i do onKeypress={(ev) => { this.handleKeypress(ev); }}
        return <InputContainer label={this.schema.label} id={this.id} className={[this.props.className, 'text-input']} ref="container">
            <div className="input-wrapper">
                <input ref="input"
                    autoComplete={this.props.autocomplete}
                    defaultValue={this.schema.default}
                    id={this.id}
                    maxLength={this.schema.max}
                    name={this.schema.name}
                    placeholder={this.props.placeholder}
                    onBlur={this.handleBlur.bind(this)}
                    onFocus={this.handleFocus.bind(this)}
                    onInput={this.handleInput.bind(this)}
                    onKeyPress={this.handleKeyPress.bind(this)}
                    tabIndex={this.props.tabIndex}
                    type={this.props.textType} />
            </div>
        </InputContainer>;
    }
}