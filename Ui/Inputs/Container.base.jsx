class InputContainer extends React.Component {
    /**
     * @param {object} props
     * @param {string} props.name
     * @param {string} [props.label]
     * @param {object} [props.i18n]
     * @param {string} [props.fill]
     * @param {string} [props.className]
     * @param {ValueSchema} [props.schema]
     */
    constructor(props) {
        props.fill = props.fill || props.name
        props.id = props.id || props.name;
        props.containerId = document.createUniqueId(props.id + '-input');
        props.inputId = document.createUniqueId(props.id + '-input');
        super(props);
        this.state = { schema: props.schema || new ValueSchema() };
    }

    render(input) {
        let className = document.buildClassName(['input', this.props.inputClassName, this.props.className]);

        return <div id={this.props.containerId} className={className} ref="container">
            {this.props.label ? <label htmlFor={this.props.inputId}>{this.props.label.t()}</label> : null}
            {input}
            <div className="error-message">
                <p ref="error"></p>
            </div>
        </div>;
    }

    // #region Error

    /**
     * Sets the error message.
     * @param {string} message
     */
    setError(message) {
        this.refs.container.classList.add('error');
        this.refs.error.innerHTML = message;
    }

    /**
     * Clears the errors message.
     */
    clearError() {
        this.refs.container.classList.remove('error');
        this.refs.error.innerHTML = '';
    }

    /**
     * Determines if the input has an error message.
     * @returns {boolean}
     */
    hasError() {
        return this.refs.container.classList.contains('error');
    }

    // #endregion

    // #region Value

    /**
     * Sets the value of this input.
     * @param {any} value
     */
    fill(value) {
        this.refs.input.value = value;
    }

    /**
     * Clears the value of this input.
     */
    clear() {
        this.refs.input.value = null;
    }

    /**
     * Gets the value of the input and parses it to the schema's type.
     * @returns {any}
     */
    collect() {
        return Parser.parse(this.raw(), this.state.schema.type);
    }

    /**
     * Gets the raw value of the input without any parsing.
     * @returns {any}
     */
    raw() {
        return this.refs.input.value;
    }

    /**
     * Determines if the input is valid and adds an error message if it is not.
     * @returns {boolean}
     */
    isValid() {
        let result = Validator.validate(this.raw(), this.state.schema);
        if (result.isValid) { return true; }
        this.setError(result.message);
        return false;
    }

    /**
     * Determines if the input is disabled. 
     */
    isDisabled() {
        return this.refs.input.closest('*[disabled]') ? true : false;
    }

    /**
     * Disables or enables the input.
     * @param {boolean} toggle If true or undefined, disables the inputs, otherwise enables it.
     */
    disable(toggle) {
        if (typeof toggle === 'undefined') { toggle = true; }
        this.refs.input.disabled = toggle;
    }

    // #endregion

    // #region Events

    /**
     * Handles key press events by preventing input that doesn't match the schema type.
     * @param {Event} ev
     */
    handleKeyPress(ev) {
        let v = ev.key;
        let isInputValid = true;

        switch (this.state.schema.type) {
            case 'int':
                isInputValid = /^-?\d+$/.test(v);
                break;
            case 'number':
                isInputValid = /^-?\d+$/.test(v);
                break;
            default:
                return;
        }

        if (isInputValid && this.props.onKeyPress) {
            this.props.onKeyPress(ev);
        } else {
            ev.preventDefault();
        }
    }

    // #endregion
}