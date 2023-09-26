class HiddenInput extends BaseInput {
    constructor(props) {
        props.className = 'hidden-input';
        super(props);
    }

    render() {
        let className = document.buildClassName('text-input', this.props.className);
        return <InputContainer className={className} id={this.containerId} inputId={this.inputId} ref="container">
            <input ref="input"
                type="hidden"
                name={this.name}
                value={this.props.value}
                id={this.inputId} />
        </InputContainer>
    }
}