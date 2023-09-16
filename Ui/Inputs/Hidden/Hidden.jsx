class HiddenInput extends InputContainer {
    constructor(props) {
        props.className = 'hidden-input';
        super(props);
    }

    render() {
        return super.render(<input ref="input"
            type="hidden"
            name={this.name}
            value={this.props.value}
            id={this.inputId} />);
    }
}