class TextareaInput extends BaseInput {
    render() {
        return <InputContainer label={this.schema.label} className={[this.props.className, 'textarea-input']} tooltip={this.props.tooltip} ref="container">
            <div className="input-wrapper">
                <textarea ref="input"
                    id={this.id}
                    maxLength={this.schema.max}
                    name={this.schema.name}
                    onBlur={ev => this.handleBlur(ev)}
                    onFocus={ev => this.handleFocus(ev)}>
                    {this.schema.default}
                </textarea>
            </div>
        </InputContainer>;
    }
}