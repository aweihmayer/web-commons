class TagInput extends BaseInput {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    render() {
        return <InputContainer label={this.schema.label} id={this.id} className={[this.props.className, 'tag-input']} ref="container">
            <div>
                <div className="input-wrapper">
                    <input ref="input"
                        autoComplete="off"
                        id={this.id}
                        name={this.schema.name}
                        onBlur={ev => this.handleBlur(ev)}
                        onChange={ev => this.search(ev)}
                        onFocus={ev => this.handleFocus(ev)}
                        onKeyPress={ev => this.search(ev)}
                        type="search" />
                    <ul ref="options"></ul>
                </div>
                <ul>
                    {this.state.data.map(d =>
                        <li data-value={d.value} title={d.value} key={d.value}>
                            {d.name}
                            <Button value={d.value} onClick={ev => this.remove(d.value)}>x</Button>
                        </li>
                    )}
                </ul>
            </div>
        </InputContainer>;
    }

    search(ev) {
        this.closeSearch();
        let results = this.props.onSearch(ev.data);
        if (!results.any()) { return; }

        results.forEach(r => {
            let el = document.createElement('li');
            el.dataset.value = r.value;
            el.innerHTML = r.name;
            el.onclick = ev => {
                this.add({
                    value: ev.target.dataset.value,
                    name: ev.target.innerHTML
                });
            };
            this.refs.options.appendChild(el);
        });

        this.refs.options.classList.add('open');
    }

    closeSearch() {
        this.refs.options.classList.remove('open');
        this.refs.options.innerHTML = '';
    }

    handleBlur() {
        // Set a small timeout because or else the blur event closes the search before we can add a tag
        setTimeout(() => { this.closeSearch() }, 200);
    }

    parse(data) {
        if (Array.isArray(data)) {
            return data.map(d => this.parse(d));
        }

        if (typeof data === 'object') {
            if (typeof data.toOption === 'function') { return data.toOption(); }
            if (data.name && data.value) { return data; }
        }

        if (typeof this.props.parse === 'function') {
            data = this.props.parse(data);
            return this.parse(data);
        }

        return data;
    }

    add(value) {
        if (!this.schema.isEnumerable && this.count() > 0) {
            this.setError('Maximum of 1');
            return;
        }

        if (typeof this.schema.max === 'number' && this.count() > this.schema.max) {
            this.setError('Maximum of ' + this.schema.max);
            return;
        }

        value = this.parse(value);
        let data = [...this.state.data];
        data.push(value);
        this.setState({ data: data });
    }

    remove(value) {
        let data = this.state.data.filter(d => d.value !== value);
        this.setState({ data: data });
    }

    count() {
        return this.state.data.length;
    }

    raw() {
        let data = this.state.data.map(d => d.value);
        if (this.schema.isEnumerable) { return data; }
        return (data.length > 0) ? data[0] : null;
    }

    fill(value) {
        if (!value) {
            this.setState({ data: [] });
            return;
        }
        value = this.parse(value);
        if (!Array.isArray(value)) { value = [value]; }
        this.setState({ data: value });
    }

    clear() {
        this.closeSearch();
        this.setState({ data: [] });
        this.clearError();
    }
}