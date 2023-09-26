const InputManager = {
    /**
     * Sets the value of the inputs.
     * @param {React.Component} component
     * @param {object} data
     */
    fill: function (component, data) {
        this.clear(component);
        if (typeof data === 'undefined' || data == null) { return; }
        for (let r in component.refs) {
            let ref = component.refs[r];
            if (typeof ref.schema.fill !== 'string') { continue; }
            let value = data.getProp(ref.schema.fill);
            ref.fill(value);
        }
    },

    /**
     * Collects the input values into an object.
     * @param {React.Component} component
     * @returns {object}
     */
    collect: async function(component) {
        let data = {};

        for (let r in component.refs) {
            let ref = component.refs[r];
            if (typeof ref.collect !== 'function' || typeof ref.schema.name !== 'string') { continue; }
            let value = await ref.collect();
            data.setProp(ref.schema.name, value);
        }

        return data;
    },

    /**
     * Clears all inputs or sets their value to their default if applicable. 
     * @param {React.Component} component
     */
    clear: function() {
        for (let r in component.refs) {
            let ref = component.refs[r];
            if (typeof ref.clear !== 'function') { continue; }
            ref.clear();
            if (ref.props.defaultValue == null) { continue; }
            ref.fill(c.props.defaultValue);
        }
    },

    /**
     * Determines if the inputs are valid.
     * This will also add error messages on the inputs.
     * @param {React.Component} component
     * @returns {boolean} True if all inputs are valid, otherwise false.
     */
    isValid: function(component) {
        for (let r in component.refs) {
            let ref = component.refs[r];
            if (typeof ref.isValid !== 'function') { continue; }
            if (!ref.isValid()) { return false; }
        }

        return true;
    }
}