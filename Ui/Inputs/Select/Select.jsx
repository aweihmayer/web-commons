class SelectInput extends BaseInput {
    render() {
        return <InputContainer label={this.schema.label} id={this.id} className={[this.props.className, 'select-input']} ref="container">
            <div className="input-wrapper">
                <select ref="input"
                    defaultValue={this.props.value}
                    id={this.id}
                    name={this.schema.name}
                    onChange={this.handleChange.bind(this)}
                    onFocus={this.handleFocus.bind(this)}>
                    {this.schema.values.map((v, i) =>
                        <option key={i} value={v}>{this.schema.i18n[v].t(v)}</option>
                    )}
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