class Form extends React.Component {
    render() {
        return <form action="#" encType={this.props.encType} onSubmit={this.submit.bind(this)} ref="form">
            {this.props.children}
        </form>;
    }

    /**
     * Determines if form is valid and submits it if it is.
     * @param {Event} [ev] The submit event.
     */
    submit(ev) {
        if (ev) { ev.preventDefault(); }
        else { ev = {}; }
        let that = this;

        return new Promise(function (resolve, reject) {
            that.startLoading();
            if (that.isValid()) {
                resolve(that.collect());
            } else {
                that.stopLoading();
                reject(new Error('Cannot submit invalid data'));
            }
        })
        .then(data => {
            ev.data = data;
            return ev;
        })
        .then(this.props.onSubmit)
        .finally(that.stopLoading());
    }

    /**
     * Activates all loaders in the form.
     */
    startLoading() {
        Loader.start(this.refs.form);
    }

    /**
     * Deactivates all loaders in the form. 
     */
    stopLoading() {
        Loader.stop(this.refs.form);
    }
}