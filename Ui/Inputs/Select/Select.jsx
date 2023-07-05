class SelectInput extends InputContainer {
    constructor(props) {
        super(props);
        this.inputClassName = 'select-input';
    }

    render() {
        var options = [];
        if (Array.isArray(this.state.schema.options)) {
            for (var i = 0; i < this.state.schema.options.length; i++) {
                var v = this.state.schema.options[i];
                options.push(<option key={i} value={v}>{this.state.i18n[v].i18n()}</option>);
            }
        } else {
            for (var k in this.state.schema.options) {
                options.push(<option key={k} value={k}>{this.state.i18n[k].i18n()}</option>);
            }
        }

        return super.render(<div className="input-wrapper">
            <select ref="input"
            name={this.name}
            id={this.inputId}
            onFocus={this.clearError.bind(this)}
            defaultValue={this.props.value}
            onChange={this.props.onChange}>
            {options}
            </select>
        </div>);
    }

    fill(v) {
        var options = this.refs.input.getElementsByTagName('option');
        for (var y = 0; y < options.length; y++) {
            if (options[y].value == v) {
                options[y].selected = true;
                return;
            }
        }
    }
}