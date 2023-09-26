class BaseInput extends React.Component {
    constructor(props) {
        super(props);
        this.schema = this.props.schema ? new ValueSchema(this.props.schema, this.props) : new ValueSchema(this.props);
        this.id = this.props.id || this.props.name;
        this.containerId = document.createUniqueId(this.id + '-container');
        this.inputId = document.createUniqueId(this.id + '-input');
    }

    // #region Error

    /**
     * Sets the error message.
     * @param {string} message
     */
    setError(message) {
        this.refs.container.setError(message);
    }

    /**
     * Clears the errors message.
     */
    clearError() {
        this.refs.container.clearError();
    }

    /**
     * Determines if the input has an error message.
     * @returns {boolean}
     */
    hasError() {
        return this.refs.container.hasError();
    }

    // #endregion

    // #region Value

    /**
     * Sets the value of this input.
     * @param {any} value
     */
    fill(value) {
        this.refs.input.value = Parser.parse(value, this.schema.type);
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
        let value = this.raw();
        return Parser.parse(value, this.schema.type);
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
        let result = this.validate();
        if (result.isValid) { return true; }
        this.setError(result.message);
        return false;
    }

    /**
     * Validates the value and returns details about the validation.
     * @returns {object}
     */
    validate() {
        return Validator.validate(this.raw(), this.schema);
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

        switch (this.schema.type) {
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