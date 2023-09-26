class InputContainer extends React.Component {
    render() {
        let className = document.buildClassName('input-container', this.props.className);

        return <div id={this.props.id} className={className} ref="container">
            {this.props.label ? <label htmlFor={this.props.inputId}>{this.props.label.t()}</label> : null}
            {this.props.children}
            <div className="error-message">
                <p ref="message"></p>
            </div>
        </div>;
    }

    setError(message) {
        this.refs.container.classList.add('error');
        this.refs.message.innerHTML = message;
    }

    clearError() {
        this.refs.container.classList.remove('error');
        this.refs.message.innerHTML = '';
    }

    hasError() {
        return this.refs.container.classList.contains('error');
    }
}