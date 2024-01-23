React.Component.prototype.collectRefs = function () {
    let components = [];
    for (let k in this.refs) components.push(this.refs[k]);
    if (this.props.parent != null) for (let k in this.props.parent.refs) components.push(this.props.parent.refs[k]);
    return components.filter(c => c != this);
};

React.Component.prototype.clear = function () {
    for (let c of this.collectRefs()) {
        c.clear();
        if (typeof c.setDefaultValue === 'function') c.setDefaultValue();
    }
};

React.Component.prototype.collect = async function () {
    let data = {};
    for (let c of this.collectRefs()) {
        if (typeof c.getCollectName === 'function') {
            let n = c.getCollectName();
            let v = c.collect();
            data.setProp(n, v);
        } else {
            let v = c.collect();
            Object.assign(data, v);
        }        
    }

    return data;
};

React.Component.prototype.fill = function (data) {
    if (isEmpty(data)) return;
    this.clear();
    for (let c of this.collectRefs()) {
        let n = (typeof c.getFillName === 'function') ? c.getFillName() : null;
        if (n === null) c.fill(data);
        else if (data.hasProp(n)) c.fill(data.getProp(n));
    }
};

React.Component.prototype.isValid = async function () {
    for (let c of this.collectRefs()) {
        if (typeof c.isValid === 'function' && await !c.isValid()) return false;
    }

    return true;
};