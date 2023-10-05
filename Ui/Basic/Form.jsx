class Form extends React.Component {
    static defaultProps = {
        encType: null,
        onError: (ev) => ev,
        onSubmit: (ev) => ev,
        refs: {}
    };

    render() {
        return <form action="#" encType={this.props.encType} onSubmit={(ev) => { this.submit(ev); }} ref="form">
            {this.props.children}
        </form>;
    }

    submit(ev) {
        if (ev) { ev.preventDefault(); }
        else { ev = {}; }

        return new Promise((resolve, reject) => {
            this.startLoading();
            if (InputManager.isValid(this.props.refs)) {
                resolve(InputManager.collect(this.props.refs));
            } else {
                reject(new Error('Cannot submit invalid form data'));
            }
        })
        .then(data => {
            ev.data = data;
            return ev;
        })
        .then(this.props.onSubmit)
        .catch(this.props.onError)
        .finally(this.stopLoading());
    }

    fill(data) {
        InputManager.fill(this.props.refs, data);
    }

    startLoading() {
        for (let r in this.refs) {
            Loader.start(this.refs[r]);
        }
    }

    stopLoading() {
        for (let r in this.refs) {
            Loader.stop(this.refs[r]);
        }
    }
}