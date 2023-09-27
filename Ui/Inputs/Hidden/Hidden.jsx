class HiddenInput extends BaseInput {
    render() {
        let className = document.buildClassName('hidden-input', this.props.className);
        return <InputContainer className={className} id={this.containerId} inputId={this.inputId} ref="container">
            <input ref="input"
                type="hidden"
                name={this.name}
                defaultValue={this.props.defaultValue}
                id={this.inputId} />
        </InputContainer>
    }
}