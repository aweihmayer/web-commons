class InputContainer extends React.Component {
    render() {
        let id = this.props.id + '-container';
        let className = toClassName('input-container', this.props.className);

        return <div id={id} className={className} ref="container">
            <div className="input-labels">
                {this.props.label ? <label htmlFor={this.props.id}>{translate(this.props.label)}</label> : null}
                <Tooltip tooltip={this.props.tooltip} />
            </div>
            {this.props.children}
            <div className="input-message">
                <p ref="message"></p>
            </div>
        </div>;
    }

    setMessage(message) {
        this.refs.message.innerHTML = message;
    }

    clearMessage() {
        this.refs.message.innerHTML = '';
    }

    setError(message) {
        this.refs.container.classList.add('error');
        this.setMessage(message);
    }

    clearError() {
        this.refs.container.classList.remove('error');
        this.clearMessage();
    }

    hasError() {
        return this.refs.container.classList.contains('error');
    }
}