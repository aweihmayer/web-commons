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
        if (ev) ev.preventDefault();
        else ev = {};

        if (this.isLoading()) return;

        (async () => {
            try {
                this.startLoading();
                if (!await this.isValid()) throw ev;
                const data = await this.collect(true);
                ev.data = data;
                await this.props.onSubmit(ev);
            } catch (ex) {
                await this.props.onValidationFail(ex);
            } finally {
                this.stopLoading();
            }
        })();
    }

    startLoading() {
        this._isLoading = true;
        let components = this.collectRefs(true);
        Loader.start(components);
    }

    stopLoading() {
        this._isLoading = false;
        let components = this.collectRefs();
        for (let c of components) Loader.stop(c);
    }

    isLoading() { return this._isLoading; }
}