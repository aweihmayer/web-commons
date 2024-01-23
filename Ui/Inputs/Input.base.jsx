class BaseInput extends React.Component {
    constructor(props) {
        super(props);
        this.schema = this.props.schema ? new ValueSchema(this.props.schema, this.props) : new ValueSchema(this.props);
        this.id = this.schema.name + '-input-id';
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
     * Gets the name of the input for filling.
     * @returns {string}
     */
    getFillName() {
        return this.schema.fill;
    }

    /**
     * Gets the value of the input and parses it to the schema's type.
     * @returns {any}
     */
    async collect() {
        let v = await this.collectRaw();
        return Parser.parse(v, this.schema.type, this.schema);
    }

    /**
     * Gets the raw value of the input without any parsing.
     * @returns {any}
     */
    async collectRaw() {
        return this.refs.input.value;
    }

    /**
     * Gets the name of the input for collection.
     * @returns {string}
     */
    getCollectName() {
        return this.schema.name;
    }

    /**
     * Clears the value of this input.
     */
    clear() {
        this.refs.input.value = null;
    }

    // #region Validation

    /**
     * Determines if the input is valid and adds an error message if it is not.
     * @returns {boolean}
     */
    async isValid() {
        let result = await this.validate();
        if (result.isValid) return true;
        this.setError(result.message);
        return false;
    }

    /**
     * Validates the value and returns details about the validation.
     * @returns {object}
     */
    async validate() {
        let v = await this.collectRaw();
        return Validator.validate(v, this.schema.type, this.schema);
    }

    // #endregion

    // #region Utitlity

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

    handleBlur(ev) {
        this.isValid();
        if (this.props.onFocus) this.props.onFocus(ev);
    }

    handleChange(ev) {
        if (this.props.onChange) {
            ev.data = this.collect();
            this.props.onChange(ev);
        }
    }

    handleFocus(ev) {
        this.clearError();
        if (this.props.onFocus) this.props.onFocus(ev);
    }

    handleInput(ev) {
        if (this.props.onInput) this.props.onInput(ev);
    }

    handleKeyPress(ev) {
        if (this.props.onKeyPress) this.props.onKeyPress(ev);
    }

    // #endregion
}