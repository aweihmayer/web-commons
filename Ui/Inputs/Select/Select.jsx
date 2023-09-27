class SelectInput extends BaseInput {
    render() {
        let options = this.schema.values.map((v, i) => <option key={i} value={v}>{this.schema.i18n[v].t(v)}</option>);

        let className = document.buildClassName('select-input', this.props.className);
        return <InputContainer label={this.schema.label} className={className} id={this.containerId} inputId={this.inputId} ref="container">
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