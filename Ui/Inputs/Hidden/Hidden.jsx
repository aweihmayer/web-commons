class HiddenInput extends InputContainer {
    constructor(props) {
        super(props);
        this.inputClassName = 'hidden-input';
    }

    render() {
        return super.render(<input ref="input"
            type="hidden"
            name={this.name}
            value={this.props.value}
            id={this.inputId} />);
    }
}