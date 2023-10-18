const InputManager = {
    fill: function (component, data, filter) {
        this.clear(component, filter);
        if (typeof data === 'undefined' || data == null) { return; }
        let refs = component.refs ?? component;
        for (let r in refs) {
            let ref = refs[r];
            if (typeof ref.schema !== 'object' || typeof ref.schema.fill !== 'string') { continue; }
            if (!data.hasProp(ref.schema.fill)) { continue; }
            if (typeof filter === 'function' && !filter(ref)) { continue; }
            let value = data.getProp(ref.schema.fill);
            ref.fill(value);
        }
    },

    collect: async function (component, filter) {
        let data = {};

        let refs = component.refs ? component.refs : component;
        for (let r in refs) {
            let ref = refs[r];
            if (typeof ref.collect !== 'function' || typeof ref.schema !== 'object' || typeof ref.schema.name !== 'string') { continue; }
            if (typeof filter === 'function' && !filter(ref)) { continue; }
            let value = await ref.collect();
            data.setProp(ref.schema.name, value);
        }

        return data;
    },

    clear: function (component, filter) {
        let refs = component.refs ?? component;
        for (let r in refs) {
            let ref = refs[r];
            if (typeof ref.clear !== 'function') { continue; }
            if (typeof filter === 'function' && !filter(ref)) { continue; }
            ref.clear();
            if (ref.schema.default == null) { continue; }
            ref.fill(ref.schema.default);
        }
    },

    isValid: function (component, filter) {
        let refs = component.refs ?? component;
        let isValid = true;
        for (let r in refs) {
            let ref = refs[r];
            if (typeof ref.isValid !== 'function') { continue; }
            if (typeof filter === 'function' && !filter(ref)) { continue; }
            if (!ref.isValid()) { isValid = false; }
        }

        return isValid;
    }
}