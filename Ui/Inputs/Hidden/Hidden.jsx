class HiddenInput extends BaseInput {
    render() {
        return <InputContainer label={this.schema.label} id={this.id} className={[this.props.className, 'hidden-input']} ref="container">
            <input ref="input"
                type="hidden"
                name={this.schema.name}
                defaultValue={this.schema.default}
                id={this.id} />
        </InputContainer>
    }
}