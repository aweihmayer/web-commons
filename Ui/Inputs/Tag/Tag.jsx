class TagInput extends BaseInput {
    constructor(props) {
        super(props);
        this.inputClassName = 'tag-input';
    }

    render() {
        let className = document.buildClassName('text-input', this.props.className);
        return <InputContainer className={className} id={this.containerId} inputId={this.inputId} ref="container">
            <div>
                <div className="input-wrapper">
                    <input type="search" ref="input"
                        name={this.name}
                        onChange={this.search.bind(this)}
                        onFocus={this.clearError.bind(this)}
                        onBlur={this.handleOnBlur.bind(this)}
                        onKeyPress={this.search.bind(this)}
                        id={this.inputId}
                        autoComplete="off" />
                    <ul ref="options"></ul>
                </div>
                <ul ref="tags"></ul>
            </div>
        </InputContainer>;
    }

    search(ev) {
        // TODO
        if (typeof this.state.schema.options == 'function') {
            let results = this.state.schema.options(this.refs.input.value);
        } else if (this.state.schema.options instanceof Dao) {
            let results = this.state.schema.options.search(this.refs.input.value, { onlySearchable: false });
        } else {
            return;
        }

        this.refs.options.innerHTML = '';

        for (let i = 0; i < results.length; i++) {
            let option = document.createElement('li');
            option.dataset.value = results[i].id;
            option.innerHTML = results[i].getLabel().full;
            option.onclick = this.add.bind(this);
            this.refs.options.appendChild(option);
        }

        this.refs.options.classList.add('open');
    }

    closeSearch() {
        this.refs.options.classList.remove('open');
        this.refs.options.innerHTML = '';
    }

    handleOnBlur() {
        // Set a small timeout because or else the blur event closes the search before we can add a tag
        setTimeout(function () { this.closeSearch(); }.bind(this), 200);
    }

    add(ev) {
        if (this.state.schema.max !== false && this.count() >= this.state.schema.max) {
            this.setState({ error: 'Can only have ' + this.state.schema.max + ' items' });
            return;
        }

        if (ev.target) {
            let node = ev.target;
            let data = {
                value: node.dataset.value,
                label: node.innerHTML };
        } else if (ev.id) {
            let data = {
                value: ev.id,
                label: ev.name || ev.label.full };
        } else {
            return;
        }

        let tag = document.createElement('li');
        tag.dataset.value = data.value;
        tag.setAttribute('title', data.value);
        tag.innerHTML = data.label;

        let closeButton = document.createElement('span');
        closeButton.innerHTML = 'x';
        closeButton.onclick = this.remove.bind(this);
        tag.appendChild(closeButton);

        this.refs.tags.appendChild(tag);
    }

    remove(ev) {
        let option = ev.target.closest('li');
        option.parentNode.removeChild(option);
    }

    count() {
        return this.refs.tags.childNodes.length;
    }

    raw() {
        return this.refs.tags.querySelectorAll('ul li').map(tag => tag.dataset.value); // todo return one for single tag input
        /*

        if (this.state.schema.max != false && this.state.schema.max == 1) {
            if (values.length > 0) { return values[0]; }
            return null;
        }*/
    }

    fill(value) {
        if (!value) { this.refs.tags.innerHTML = ''; return; }

        if (!Array.isArray(value)) {
            value = [value];
        }

        for (let v of value) {
            this.add(v);
        }
    }

    clear() {
        this.closeSearch();
        this.refs.tags.innerHTML = '';
        this.setState({ error: null }); // TODO errors not using state anymore
    }
}