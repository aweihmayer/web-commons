/**
 * Defines a container of inputs. 
 */
class FieldSet extends React.Component {
    /**
     * Sets the value of the inputs.
     * @param {object} data
     */
    fill(data) {
        if (typeof data == 'undefined' || data == null) { return; }
        for (let ref of this.refs) {
            if (!ref.fillName) { continue; }
            let value = data.getProp(ref.fillName);
            ref.fill(value);
        }
    }

    /**
     * Collects the input values into an object.
     * @returns {object}
     */
    async collect() {
        let data = {};

        for (let ref of this.refs) {
            if (!ref.collect || !ref.name) { continue; }
            let value = await ref.collect();
            data.setProp(ref.props.name, value);
        }

        return data;
    }

    /**
     * Clears all inputs or sets their value to their default if applicable. 
     */
    clear() {
        for (let ref of this.refs) {
            if (!ref.clear) { continue; }
            ref.clear();
            if (ref.props.defaultValue == null) { continue; }
            ref.fill(c.props.defaultValue);
        }
    }

    /**
     * Determines if the inputs are valid.
     * This will also add error messages on the inputs.
     * @returns {boolean} True if all inputs are valid, otherwise false.
     */
    isValid() {
        for (let ref of this.refs) {
            if (!ref.isValid) { continue; }
            if (!ref.isValid()) { return false; }
        }

        return true;
    }
}