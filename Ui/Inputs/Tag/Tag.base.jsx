class TagInput extends BaseInput {
    constructor(props) {
        super(props);
        this.options = this.props.options ?? this.schema.toOptions();
        this.state = { data: [] };
    }

    render(input) {
        return <InputContainer label={this.schema.label} id={this.id} className={[this.props.className, this.className, 'tag-input']} tooltip={this.props.tooltip} ref="container">
            <div>
                {input}
                <ul>
                    {this.state.data.map(d =>
                        <li data-value={d.value} title={d.value} key={d.value}>
                            {d.name}
                            <button type="button" data-value={d.value} onClick={ev => this.remove(d.value)}>x</button>
                        </li>
                    )}
                </ul>
            </div>
        </InputContainer>;
    }

    toOption(data) {
        if (Array.isArray(data)) {
            return data.map(d => this.toOption(d));
        } else if (typeof data === 'object') {
            if (typeof data.toOption === 'function') return data.toOption();
            else if (data.name && data.value) return data;
            else return data;
        } else {
            const option = this.options.find(o => o.value == data);
            if (option) return option;
            else return { name: data, value: data };
        }
    }

    add(value) {
        if (!this.schema.isEnumerable && this.count() > 0) {
            this.setError('Maximum of 1');
        } else if (typeof this.schema.max === 'number' && this.count() > this.schema.max) {
            this.setError('Maximum of ' + this.schema.max);
        } else {
            value = this.toOption(value);
            let data = [...this.state.data];
            data.push(value);
            this.setState({ data: data });
        }
    }

    remove(value) {
        let data = this.state.data.filter(d => d.value !== value);
        this.setState({ data: data });
    }

    count() {
        return this.state.data.length;
    }

    collectRaw() {
        let data = this.state.data.map(d => d.value);
        if (this.schema.isEnumerable) return data;
        else return (data.length > 0) ? data[0] : null;
    }

    fill(value) {
        if (!value) {
            this.setState({ data: [] });
        } else {
            value = this.toOption(value);
            if (!Array.isArray(value)) value = [value];
            this.setState({ data: value });
        }
    }

    clear() {
        this.setState({ data: [] });
        this.clearError();
    }
}