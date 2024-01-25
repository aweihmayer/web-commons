React.Component.prototype.collectRefs = function (withParent) {
    let components = [];
    this.refs.toArray().forEach(c => components.push(c));
    for (let k in this.refs) components.push(this.refs[k]);
    if (!withParent || !this.props.parent) return components;
    for (let k in this.props.parent.refs) components.push(this.props.parent.refs[k]);
    return components.filter(c => c != this);
};

React.Component.prototype.clear = function (withParent) {
    for (let c of this.collectRefs(withParent)) {
        if (typeof c.clear === 'function') c.clear();
        if (typeof c.setDefaultValue === 'function') c.setDefaultValue();
    }
};

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

React.Component.prototype.isValid = async function (withParent) {
    let isValid = true;
    for (let c of this.collectRefs(withParent)) {
        if (typeof c.isValid === 'function' && !await c.isValid()) isValid = false;
    }

    return isValid;
};