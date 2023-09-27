class TextareaInput extends BaseInput {
    render() {
        let className = document.buildClassName('textarea-input', this.props.className);
        return <InputContainer label={this.schema.label} className={className} id={this.containerId} inputId={this.inputId} ref="container">
            <div className="input-wrapper">
                <textarea ref="input"
                    name={this.name}
                    id={this.inputId}
                    onFocus={this.clearError.bind(this)}
                    onBlur={this.isValid.bind(this)}
                    maxLength={this.schema.max}>{this.props.defaultValue}</textarea>
            </div>
        </InputContainer>;
    }
}