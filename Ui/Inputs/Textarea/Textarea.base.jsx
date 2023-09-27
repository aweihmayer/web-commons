class TextareaInput extends BaseInput {
    render() {
        return <InputContainer label={this.schema.label} className={[this.props.className, 'textarea-input']} ref="container">
            <div className="input-wrapper">
                <textarea ref="input"
                    id={this.id}
                    maxLength={this.schema.max}
                    name={this.schema.name}
                    onBlur={this.handleBlur.bind(this)}
                    onFocus={this.handleFocus.bind(this)}>
                    {this.schema.default}
                </textarea>
            </div>
        </InputContainer>;
    }
}