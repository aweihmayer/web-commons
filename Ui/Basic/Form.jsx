class Form extends React.Component {
    static defaultProps = {
        encType: null,
        onValidationFail: ev => ev,
        onSubmit: ev => ev,
        refs: null
    };

    constructor(props) {
        super(props);
        this._isLoading = false;
    }

    render() {
        return <form action="#" encType={this.props.encType} onSubmit={ev => this.submit(ev)} ref="form">
            {this.props.children}
        </form>;
    }

    submit(ev) {
        if (ev) { ev.preventDefault(); }
        else { ev = {}; }

        if (this.isLoading()) { return; }

        new Promise((resolve, reject) => {
            this.startLoading();
            if (InputManager.isValid(this.props.refs)) {
                resolve(this.collect());
            } else {
                reject(ev);
            }
        })
        .then(data => {
            ev.data = data;
            return ev;
        })
        .then(ev => this.props.onSubmit(ev))
        .catch(ex => this.props.onValidationFail(ex))
        .finally(ev => { this.stopLoading() });
    }

    fill(data, filter) {
        let refs = this.getPropRefs();
        InputManager.fill(refs, data, filter);
    }

    async collect(filter) {
        let refs = this.getPropRefs();
        return InputManager.collect(refs, filter);
    }

    clear(filter) {
        let refs = this.getPropRefs();
        InputManager.clear(refs, filter);
    }

    startLoading() {
        this._isLoading = true;
        for (let r in this.refs) { Loader.start(this.refs[r]); }
        let childRefs = this.getPropRefs();
        for (let r in childRefs) {
            Loader.start(childRefs[r]);
        }
    }

    stopLoading() {
        this._isLoading = false;
        for (let r in this.refs) { Loader.stop(this.refs[r]); }
        let childRefs = this.getPropRefs();
        for (let r in childRefs) {
            Loader.stop(childRefs[r]);
        }
    }

    isLoading() { return this._isLoading; }

    getPropRefs() {
        let refs = [];
        if (this.props.refs == null) { return refs; }

        let components = this.props.refs;
        if (!Array.isArray(components)) { components = [components]; }

        components.forEach(c => {
            let componentRefs = c.refs;
            componentRefs = Object.keys(componentRefs)
                .map(r => componentRefs[r])
                .filter(r => !(r instanceof Form));
            refs = refs.concat(componentRefs);
        })

        if (!this.props.refFilter) { return refs; }
        let filters = this.props.refFilter;
        if (!Array.isArray(this.props.refFilter)) { filters = [filters]; }
        filters.forEach(f => {
            refs = refs.filter(f);
        });

        return refs;
    }
}