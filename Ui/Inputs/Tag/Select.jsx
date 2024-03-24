class SelectTagInput extends TagInput {
    constructor(props) {
        super(props);
        this.className = 'select-tag-input';
    }


    render() {
        return super.render(<div className="input-wrapper">
            <select ref="input"
                defaultValue={this.props.value}
                id={this.id}
                name={this.schema.name}
                onChange={ev => this.handleChange(ev)}
                onFocus={ev => this.handleFocus(ev)}>
                {this.options.map(o => <option key={o.value} value={o.value}>{o.name}</option>)}
            </select>
        </div>);
    }

    handleChange(ev) {
        this.add(this.refs.input.value);
        super.handleChange(ev);
    }
}