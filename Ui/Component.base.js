/**
 * Collects each ref of the component.
 * @param {any} withParent If true, also collects the refs of the parent component.
 * @returns {Array}
 */
React.Component.prototype.collectRefs = function (withParent) {
    let components = Object.toArray(this.refs);
    if (!withParent || !this.props.parent) return components;
    return components.concat(Object.toArray(this.props.parent.refs)).filter(c => c != this);
};

/**
 * Collects each ref of the component and the subrefs of each ref if the 'getRefTree' function is defined.
 * @returns {Array}
 */
React.Component.prototype.getAllRefs = function () { // TODO breakpoint
    let refs = [this];
    Object.toArray(this.refs).forEach(r => {
        refs.push(r);
        if (typeof r.getRefTree === 'function') refs = refs.concat(r.getRefTree());
    });
    return refs;
};

/**
 * Gets the parent component.
 * @returns {React.Component}
 */
React.Component.prototype.getParent = function () {
    return this.props.parent ?? null;
};

/**
 * Gets the top parent component.
 * @returns {React.Component}
 */
React.Component.prototype.getTopParent = function () {
    let parent = this;
    while (parent.getParent() !== null) parent = parent.getParent();
    return parent;
};

/**
 * Calls the 'clear' function for each ref. Override the 'clear' function to customize.
 * @param {any} withParent If true, also clears the refs of the parent component.
 */
React.Component.prototype.clear = function (withParent) {
    for (let c of this.collectRefs(withParent)) {
        if (typeof c.clear === 'function') c.clear();
        if (typeof c.setDefaultValue === 'function') c.setDefaultValue();
    }
};

/**
 * Collects the value of each ref that has the 'getCollectName' function defined which returns a string that represend a JSON path. Override the 'collect' function to customize data collection.
 * @param {any} withParent If true, also collects the values of the parent component.
 * @returns {object}
 */
React.Component.prototype.collect = async function (withParent) {
    let data = {};
    for (let c of this.collectRefs(withParent)) {
        if (typeof c.collect !== 'function') continue;
        else if (typeof c.getCollectName === 'function') {
            let n = c.getCollectName();
            let v = await c.collect();
            data.setProp(n, v);
        } else {
            let v = await c.collect();
            Object.assign(data, v);
        }
    }

    return data;
};

/**
 * Fills the value of each ref that has the 'getFillName' function defined which returns a string that represents a JSON path. Override the 'fill' function to customize data filling.
 * @param {object} data The data to fill.
 * @param {any} withParent If true, also fills the values of the parent component.
 */
React.Component.prototype.fill = function (data, withParent) {
    if (isEmpty(data)) return;
    this.clear();
    for (let c of this.collectRefs(withParent)) {
        let n = (typeof c.getFillName === 'function') ? c.getFillName() : null;
        if (typeof c.fill !== 'function') continue;
        else if (n === null) c.fill(data);
        else if (data.hasProp(n)) c.fill(data.getProp(n));
    }
};

/**
 * Determines if the component has a valid value. Override the 'isValid' function to customize validation.
 * @param {any} withParent If true, also validates the values of the parent component.
 * @returns {boolean}
 */
React.Component.prototype.isValid = async function (withParent) {
    let isValid = true;
    for (let c of this.collectRefs(withParent)) {
        if (typeof c.isValid === 'function' && !await c.isValid()) isValid = false;
    }

    return isValid;
};