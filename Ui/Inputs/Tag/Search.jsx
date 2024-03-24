class SearchableTagInput extends TagInput {
    constructor(props) {
        super(props);
        this.className = 'searchable-tag-input';
    }


    render() {
        return super.render(<div className="input-wrapper">
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
        </div>);
    }

    search(ev) {
        this.closeSearch();
        let results = this.options.fuzzySearch(this.refs.input.value, ['search']);
        if (!results.any()) return;

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
        setTimeout(() => { this.closeSearch() }, 100);
    }

    clear() {
        this.closeSearch();
        super.clear();
    }
}