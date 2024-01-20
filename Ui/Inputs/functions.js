React.Component.prototype.collectRefs = function () {
    let components = [];
    for (let k in this.refs) components.push(this.refs[k]);
    if (this.props.parent != null) for (let k in this.props.parent.refs) components.push(this.props.parent.refs[k]);
    return components.filter(c => c != this);
};

React.Component.prototype.clear = function () {
    let components = this.collectRefs();
    for (let c of components) {
        if (typeof c.clearValue === 'function') c.clearValue();
        if (typeof c.setDefaultValue === 'function') c.setDefaultValue();
    }
};

React.Component.prototype.collect = async function () {
    let data = {};
    let components = this.collectRefs();
    for (let c of components) {
        if (typeof c.getValue !== 'function' || typeof c.getValueName !== 'function') continue;
        let v = await c.getValue();
        let n = c.getValueName();
        data.setProp(n, v);
    }

    return data;
};

React.Component.prototype.fill = function (data) {
    this.clear();
    if (typeof data === 'undefined' || data === null) return;
    let components = this.collectRefs();
    for (let c of components) {
        if (typeof c.setValue !== 'function') continue;
        let n = (typeof c.getValueName === 'function') ? c.getValueName() : null;
        if (n === null) c.setValue(data);
        else if (data.hasProp(n)) c.setValue(data.getProp(n));
    }
};

React.Component.prototype.isValid = async function () {
    let components = this.collectRefs();
    for (let c of components) {
        if (typeof c.isValid === 'function' && await !c.isValid()) return false;
    }

    return true;
};