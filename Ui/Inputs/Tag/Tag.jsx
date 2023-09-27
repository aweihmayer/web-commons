class TagInput extends BaseInput {
    render() {
        let className = document.buildClassName('tag-input', this.props.className);
        return <InputContainer label={this.schema.label}  className={className} id={this.containerId} inputId={this.inputId} ref="container">
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
        this.refs.options.innerHTML = '';
        let results = this.props.onSearch(ev.data);
        if (results.length === 0) { return; }

        for (let result of results) {
            let data = result.toTag ? result.toTag : result;
            let el = document.createElement('li');
            el.dataset.value = data.value;
            el.innerHTML = data.name;
            el.onclick = this.add.bind(this);
            this.refs.options.appendChild(el);
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
        if (typeof this.schema.max === 'number' && this.count() > this.schema.max) {
            this.setError('Maximum of ' + this.schema.max);
            return;
        }

        if (ev.target) {
            let node = ev.target;
            let data = { value: node.dataset.value, name: node.innerHTML };
        } else {
            return;
        }

        let el = document.createElement('li');
        el.dataset.value = data.value;
        el.setAttribute('title', data.value);
        el.innerHTML = data.name;
        let closeButton = document.createElement('span');
        closeButton.innerHTML = 'x';
        closeButton.onclick = this.remove.bind(this);
        el.appendChild(closeButton);
        this.refs.tags.appendChild(el);
    }

    remove(ev) {
        let option = ev.target.closest('li');
        option.parentNode.removeChild(option);
    }

    count() {
        return this.refs.tags.childNodes.length;
    }

    raw() {
        let data = Array.from(this.refs.tags.querySelectorAll('li')).map(tag => tag.dataset.value);
        if (this.schema.isEnumerable) { return data; }
        return (data.length > 0) ? data[0] : null;
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
        this.clearError();
    }
}