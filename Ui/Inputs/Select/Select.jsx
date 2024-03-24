class SelectInput extends BaseInput {
    constructor(props) {
        super(props);
        this.options = this.schema.toOptions();
    }

    render() {
        return <InputContainer label={this.schema.label} id={this.id} className={[this.props.className, 'select-input']} tooltip={this.props.tooltip} ref="container">
            <div className="input-wrapper">
                <select ref="input"
                    defaultValue={this.props.value}
                    id={this.id}
                    name={this.schema.name}
                    onChange={ev => this.handleChange(ev)}
                    onFocus={ev => this.handleFocus(ev)}>
                    {this.options.map(o => <option key={o.value} value={o.value}>{o.name}</option>)}
                </select>
            </div>
        </InputContainer>;
    }

    fill(value) {
        try {
            let parsedValue = Parser.parse(value, this.schema.type);
            Array.from(this.refs.input.getElementsByTagName('option')).forEach(o => {
                if (Parser.parse(o.value, this.schema.type) === parsedValue) {
                    o.selected = true;
                    return;
                }
            });
        } catch { }
    }
}