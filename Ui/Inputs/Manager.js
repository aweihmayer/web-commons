const InputManager = {
    /**
     * Sets the value of the inputs.
     * @param {React.Component} component
     * @param {object} data
     */
    fill: function (component, data) {
        this.clear(component);
        if (typeof data == 'undefined' || data == null) { return; }

        for (let r in component.getRefs()) {
            let ref = this.refs[r];
            if (typeof ref.fill !== 'function' || typeof ref.props.fill !== 'string') { continue; }
            let value = data.getProp(ref.props.fill);
            ref.fill(value);
        }
    },

    /**
     * Collects the input values into an object.
     * @param {React.Component} component
     * @returns {object}
     */
    collect: async function (component) {
        let data = {};

        for (let r in component.getRefs()) {
            let ref = this.refs[r];
            if (typeof ref.collect !== 'function' || typeof ref.props.name !== 'string') { continue; }
            let value = await ref.collect();
            data.setProp(ref.props.name, value);
        }

        return data;
    },

    /**
     * Clears all inputs or sets their value to their default if applicable. 
     * @param {React.Component} component
     */
    clear: function (component) {
        for (let r in component.getRefs()) {
            let ref = this.refs[r];
            if (typeof ref.clear !== 'function') { continue; }
            ref.clear();
            if (typeof ref.props.defaultValue === 'undefined') { continue; }
            ref.fill(c.props.defaultValue);
        }
    },

    /**
     * Determines if the inputs are valid.
     * This will also add error messages on the inputs.
     * @param {React.Component} component
     * @returns {boolean}
     */
    isValid: function (component) {
        for (let r in component.getRefs()) {
            let ref = this.refs[r];
            if (typeof ref.isValid !== 'function') { continue; }
            if (!ref.isValid()) { return false; }
        }

        return true;
    }
};