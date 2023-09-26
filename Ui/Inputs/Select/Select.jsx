class SelectInput extends BaseInput {
    constructor(props) {
        props.className = document.buildClassName(props.className, 'select-input');
        super(props);
    }

    render() {
        let options = this.state.schema.options.map((v, i) => <option key={i} value={v}>{thiis.props.i18n._t(v)}</option>);

        let className = document.buildClassName('text-input', this.props.className);
        return <InputContainer className={className} id={this.containerId} inputId={this.inputId} ref="container">
            <div className="input-wrapper">
                <select ref="input"
                    name={this.props.name}
                    id={this.props.inputId}
                    onFocus={this.clearError.bind(this)}
                    defaultValue={this.props.value}
                    onChange={this.props.onChange}>
                    {options}
                </select>
            </div>
        </InputContainer>;
    }

    fill(value) {
        try {
            let parsedValue = Parser.parse(value, this.state.schema.type);
            this.refs.input.getElementsByTagName('option').forEach(o => {
                if (Parser.parse(o.value, this.state.schema.type) === parsedValue) {
                    o.selected = true;
                    return;
                }
            });
        } catch { }
    }
}