/**
 * Toasts are light weight notifications that appear on screen temporarily.
 */
class Toast extends React.Component {
    static root = null;

    render() {
        let icon = null;
        switch (this.props.type) {
            case 'warning':
                icon = <div className="toast-icon"><svg viewBox="0 0 55 55" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#FF9700" fill-rule="evenodd">
                    <path d="M25.9999 0C11.6639 0 0 11.663 0 26s11.6639 26 25.9999 26 26-11.663 26-26-11.6638-26-26-26zm2 41c0 1.104-.896 2-2 2s-2-.896-2-2v-2c0-1.104.896-2 2-2s2 .896 2 2v2zm0-8c0 1.104-.896 2-2 2s-2-.896-2-2V11c0-1.104.896-2 2-2s2 .896 2 2v22z" stroke="none" fill-rule="nonzero" />
                </svg></div>;
                break;
            case 'info':
                icon = <div className="toast-icon"><svg viewBox="0 0 500 500" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#9C28B1" fill-rule="evenodd">
                    <path d="M229.9999 0C102.975 0 0 102.975 0 230s102.975 230 229.9999 230 230-102.974 230-230-102.9749-230-230-230zm38.333 377.36c0 8.676-7.0339 15.7101-15.71 15.7101h-43.1008c-8.676 0-15.7102-7.0341-15.7102-15.7101V202.477c0-8.676 7.0332-15.71 15.7102-15.71h43.1008c8.6761 0 15.71 7.033 15.71 15.71V377.36zM229.9999 157c-21.5388 0-39-17.461-39-39s17.4612-39 39-39 39 17.461 39 39-17.461 39-39 39z" stroke="none" fill-rule="nonzero" />
                    </svg></div>;
                break;
            case 'error':
                icon = <div className="toast-icon"><svg viewBox="0 0 55 55" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#E51C24" fill-rule="evenodd">
                    <path d="M44.3731 7.6031c-10.137-10.137-26.632-10.138-36.7699 0s-10.1371 26.6321 0 36.7701 26.6319 10.138 36.7699 0 10.1369-26.633 0-36.7701zm-8.1319 28.638a2 2 0 0 1-2.8281 0l-7.425-7.425-7.778 7.7781c-.781.7809-2.047.7809-2.828 0a2 2 0 0 1 0-2.828l7.7781-7.7781-7.4251-7.4249c-.781-.7811-.781-2.0481 0-2.828s2.047-.7811 2.828 0l7.425 7.4249 7.071-7.0709a2 2 0 0 1 2.8281 2.828l-7.071 7.0709 7.425 7.425a2 2 0 0 1 0 2.828z" stroke="none" fill-rule="nonzero" />
                </svg></div>;
                break;
            case 'success':
                icon = <div className="toast-icon"><svg viewBox="0 0 50 50" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#4CB050" fill-rule="evenodd">
                    <path d="M23.9999 0C10.7 0 0 10.7 0 24s10.7 24 23.9999 24 24-10.6999 24-24-10.7-24-24-24zM37.4 18L22.1 33.5c-.6.6-1.6.6-2.2 0L11.5 25c-.6-.6-.6-1.6 0-2.2l2.2-2.2c.5999-.6 1.5999-.6 2.2 0l4.3999 4.5c.4001.4 1.1001.4 1.5 0l11.2-11.6c.6001-.6 1.6001-.6 2.2002 0L37.4 15.7c.7.6.7 1.6 0 2.3z" stroke="none" fill-rule="nonzero" />
                </svg></div>;
                break;
        }

        let action = (this.props.actionLabel && this.props.action)
            ? <button type="button" onClick={this.handleOnActionClick.bind(this)} ref="action">{this.props.actionLabel}</button>
            : null;

        return <li>
            <div></div>
            <article
                className={this.props.type}
                data-id={this.props.id}
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}>
                {icon}
                <div className="toast-message">
                    {this.props.title ? <h6>{this.props.title}</h6> : null}
                    {this.props.message ? <p>{this.props.message}</p> : null}
                </div>
                {action}
                <button onClick={this.close.bind(this)}>X</button>
            </article>
        </li>;
    }

    /**
     * Calls the custom action event and closes the toast.
     * @param {any} ev
     */
    handleOnActionClick(ev) {
        this.refs.action.disabled = true;
        this.props.action(ev);
        this.close();
    }

    /**
     * Toasts will not disappear when hovering over them.
     */
    onMouseEnter() {
        let toasts = [...ToastContainer.instance.state.toasts];
        let i = Toast.getToastIndex(this.props.id);
        let toast = toasts[i];
        clearTimeout(toast.timeout);
    }

    /**
     * Restarts the timer to close the toast after the duration elapses.
     */
    onMouseLeave() {
        let toasts = [...ToastContainer.instance.state.toasts];
        let i = Toast.getToastIndex(this.props.id);
        let toast = toasts[i];
        toast.timeout = setTimeout(
            Toast.close.bind(this.props),
            toast.duration);
    }

    /**
     * Closes the current toast.
     */
    close() {
        Toast.close(this.props.id);
    }

    /**
     * Gets the index of a toast by id.
     * @param {any} id
     * @returns {number} The toast's index or null if it was not found.
     */
    static getToastIndex(id) {
        for (let i = 0; i < ToastContainer.instance.state.toasts.length; i++) {
            if (ToastContainer.instance.state.toasts[i].id == id) { return i; }
        }

        return null;
    }

    /**
     * Closes a toast by id.
     * @param {any} id
     */
    static close(id) {
        id = id || this.id;
        let toasts = [...ToastContainer.instance.state.toasts];
        let i = Toast.getToastIndex(id);
        let toast = toasts[i];
        clearTimeout(toast.timeout);
        toasts.splice(i, 1);
        ToastContainer.instance.setState({ toasts: toasts });
    }

    /**
     * Shows a toast.
     * @param {object} toast The toast configuration.
     * @param {'success'|'error'|'info'|'warning'} [toast.type] The type of the toast.
     * @param {string} [toast.title] The title of the toast. Appears above the message as bigger text.
     * @param {string} [toast.message] The message of the toast. Appears below the title as smaller text.
     * @param {number} [toast.duration] The duration of the toast.
     * @param {string} [toast.actionLabel] The label of the action button.
     * @param {Function} [toast.action] The on click event of the action button.
     */
    static add(toast) {
        toast.id = String.random();
        toast.duration = toast.duration || 3500;
        toast.timeout = setTimeout(
            Toast.close.bind(toast),
            toast.duration);

        let toasts = [...ToastContainer.instance.state.toasts];
        toasts.push(toast);
        ToastContainer.instance.setState({ toasts: toasts });
    }

    /**
     * Readies the DOM to show toasts by creating necessary elements.
     */
    static require() {
        let container = document.createElement('aside');
        container.id = 'app-toast';
        document.body.appendChild(container);

        Toast.root = ReactDOM.createRoot(document.getElementById('app-toast'));
        Toast.root.render(<ToastContainer />);
    }

    /**
    * Creates a toast based on an HTTP response.
    * @param {Response|number} response The response (or its code) that prompted the toast.
    * @param {{ key: number, value: value }} customs Custom toast parameters object. See Toast.add for details
    */
    addFromResponse(response, customs) {
        let status = typeof response == 'object' ? response.status : response;
        let method = response.method || 'GET';
        status = status || 500;
        customs = customs || [];

        let defaults = {
            type: (status >= 200 && status < 300) ? 'success' : 'error'
        };

        let custom = null;

        for (let c of customs) {
            if (!c.codes.includes(status)) { continue; }
            custom = c;
            break;
        }

        switch (status) {
            case 200:
                switch (method) {
                    case 'GET':
                        defaults.title = 'Success';
                        defaults.message = 'Your request was successful';
                        break;
                    case 'DELETE':
                        defaults.title = 'Deleted';
                        defaults.message = 'The item was deleted';
                        break;
                    case 'POST':
                    case 'PUT':
                        defaults.title = 'Saved';
                        defaults.message = 'The item was saved';
                        break;
                }
                break;
            case 201:
                defaults.title = 'Created';
                defaults.message = 'The item was created';
                break;
            case 400:
                defaults.title = 'Bad request';
                defaults.message = 'Your request was invalid';
                break;
            case 401:
                defaults.title = 'Unauthorized';
                defaults.message = 'You need to be signed in';
                defaults.duration = 6000;
                defaults.actionLabel = 'Signin';
                defaults.action = () => { Modal.open(<SigninModal />) };
                break;
            case 403:
                defaults.title = 'Forbidden';
                defaults.message = "You don't have the necessary permissions";
                break;
            case 404:
                defaults.title = 'Not found';
                defaults.message = 'The item you are looking for was not found';
                break;
            case 500:
                defaults.title = 'Error';
                defaults.message = 'Sorry, something went wrong on our end';
                break;
        }

        Toast.add(Object.assign(defaults, custom));
    }
}