class TextareaInput extends InputContainer {
    constructor(props) {
        super(props);
        this.inputClassName = 'textarea-input';
    }

    render() {
        return super.render(<div className="input-wrapper">
            <textarea ref="input"
            name={this.name} 
            id={this.inputId} 
            onFocus={this.clearError.bind(this)}
            onBlur={this.isValid.bind(this)}
            maxLength={this.state.schema.max}>{this.props.value}</textarea>
        </div>);
    }
}