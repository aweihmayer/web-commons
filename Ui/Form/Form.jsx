class Form extends FieldSet {
    /**
     * Determines if form is valid and submits it if it is.
     * @param {Event} [ev] The submit event.
     */
    submit(ev) {
        if (ev) { ev.preventDefault(); }
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
        .then(this.onSubmit)
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