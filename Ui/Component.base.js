React.Component.prototype.collectRefs = function (withParent) {
    let components = Object.toArray(this.refs);
    if (!withParent || !this.props.parent) return components;
    return components.concat(Object.toArray(this.props.parent.refs)).filter(c => c != this);
};

React.Component.prototype.getAllRefs = function () {
    let refs = [this];
    Object.toArray(this.refs).forEach(r => {
        refs.push(r);
        if (typeof r.getRefTree === 'function') refs = refs.concat(r.getRefTree());
    });
    return refs;
};

React.Component.prototype.getParent = function () {
    return this.props.parent ?? null;
};

React.Component.prototype.getTopParent = function () {
    let parent = this;
    while (parent.getParent() !== null) parent = parent.getParent();
    return parent;
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