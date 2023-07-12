﻿/**
 * Defines a field set that can send requests.
 */
class Form extends FieldSet {
    /**
     * The callback function if the submit was successful.
     * @param {any} ev
     */
    onSubmitSuccess(ev) {

    }

    /**
     * The callback function if the submit failed.
     * @param {any} ev
     */
    onSubmitError(ev) {

    }

    /**
     * Determines if form is valid and submits it if it is.
     * This also starts prevents the default submit event and will activate/deactivate the loader components appropriately.
     * @param {Event} [ev] The submit event.
     * @returns {boolean} True if the inputs are valid, otherwise false.
     */
    submit(onSuccess, onError, ev) {
        if (ev) { ev.preventDefault(); }

        return new Promise(function (resolve, reject) {
                this.startLoading();
                if (this.isValid()) {
                    resolve(this.collect());
                } else {
                    this.stopLoading();
                    Promise.reject('Cannot submit invalid form data');
                }
            })
            .then(data => fetch(await this.request()))
            .then(response => {
                if (!response.ok) { throw response; }
                return response.deserialize();
            })
            .then(onSuccess)
            .catch(onError)
            .finally(this.stopLoading());
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

    /**
     * Creates the request for the form.
     * @returns {Request}
     */
    async request() {
        let payload = await this.collect();
        return new Request(
            this.refs.form.getAttribute('action'), {
            method: this.refs.form.getAttribute('method').toUpperCase(),
            body: JSON.stringify(payload),
            headers: new Headers({ 'Content-Type': 'application/json;charset=UTF-8' })
        });
    }

    /**
     * Sets the form's action and method attributes.
     * @param {Route} route The route that will set the action and the method.
     * @param {any} params The params that will replace placeholders in the route.
     */
    setAction(route, params) {
        if (!this.refs.form) { return; }
        this.refs.form.setAttribute('action', route.path(params));
        this.refs.form.setAttribute('method', route.method);
    }
}