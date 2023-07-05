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
        super(props);
        this.name = props.name;
        this.fillName = props.fill || this.name;
        this.id = props.name;
        this.containerId = document.createUniqueId(this.id + '-input');
        this.inputId = document.createUniqueId(this.id + '-input');

        this.state = {
            className: props.className || '',
            label: props.label || null,
            i18n: props.i18n || {},
            error: null };

        if (this.state.i18n.i18n) { this.state.i18n = this.state.i18n.i18n; }

        this.state.schema = props.schema || {};
        this.state.schema.type = props.type || this.state.schema.type || 'string';
        this.state.schema.required = props.required || this.state.schema.required || false;
        this.state.schema.min = props.min || this.state.schema.min || false;
        this.state.schema.max = props.max || this.state.schema.max || false;
        this.state.schema.regex = props.regex || this.state.schema.regex || false;
        this.state.schema.options = props.options || this.state.schema.options || {};
    }

    render(input) {
        let containerClasses = ['input', this.inputClassName, this.state.className];
        if (this.state.error) { containerClasses.push('error'); }
        containerClasses = containerClasses.filterEmpty().join(' ').trim();

        return <div id={this.containerId} className={containerClasses} ref="container">
            {this.state.label ? <label htmlFor={this.inputId}>{this.state.label.i18n()}</label> : null}
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
        this.refs.error.innerHTML = message;
    }

    /**
     * Clears the errors message.
     */
    clearError() {
        this.refs.error.innerHTML = '';
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
     * @returns {any} The input value.
     */
    collect() {
        let result = Validator.validate(this.raw(), this.state.schema).value;
        return result.value;
    }

    /**
     * Gets the raw value of the input without any parsing.
     * @returns {any} The raw input value.
     */
    raw() {
        return this.refs.input.value;
    }

    /**
     * Determines if the input is valid.
     * This will also add error messages on the input.
     * @returns {boolean} True if the input is valid, otherwise false.
     */
    isValid() {
        let result = Validator.validate(this.raw(), this.state.schema).value;

        if (!result.isValid()) {
            this.setError(result.getMessage());
            return false;
        }

        return true;
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
        if (typeof toggle == 'undefined') { toggle = true; }
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
                isInputValid = v.isInt();
                break;
            case 'number':
                isInputValid = !isNaN(v);
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