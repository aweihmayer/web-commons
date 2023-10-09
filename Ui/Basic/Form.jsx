class Form extends React.Component {
    static defaultProps = {
        encType: null,
        onValidationFail: ev => ev,
        onSubmit: ev => ev,
        refs: {}
    };

    constructor(props) {
        super(props);
        this._isLoading = false;
    }

    render() {
        return <form action="#" encType={this.props.encType} onSubmit={ev => { this.submit(ev) }} ref="form">
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
        .then(this.props.onSubmit)
        .catch(this.props.onValidationFail)
        .finally(this.stopLoading());
    }

    fill(data, filter) {
        let refs = this.getChildrenRefs();
        InputManager.fill(refs, data, filter);
    }

    async collect(filter) {
        let refs = this.getChildrenRefs();
        return InputManager.collect(refs, filter);
    }

    clear(filter) {
        let refs = this.getChildrenRefs();
        InputManager.clear(refs, filter);
    }

    startLoading() {
        this._isLoading = true;
        for (let r in this.refs) { Loader.start(this.refs[r]); }
        let childRefs = this.getChildrenRefs();
        for (let r in childRefs) {
            Loader.start(childRefs[r]);
        }
    }

    stopLoading() {
        this._isLoading = false;
        for (let r in this.refs) { Loader.stop(this.refs[r]); }
        let childRefs = this.getChildrenRefs();
        for (let r in childRefs) {
            Loader.stop(childRefs[r]);
        }
    }

    isLoading() { return this._isLoading; }

    getChildrenRefs() {
        let refs = {};
        if (this.props.refs) {
            refs = this.props.refs.refs ?? this.props.refs;
        }

        return Object.keys(refs).map(r => refs[r]).filter(r => !(r instanceof Form));
    }
}