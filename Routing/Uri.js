class Uri {
    constructor(template, queryStringParams) {
        if (template.length === 0 || template.charAt(0) !== '/') { template = '/' + template; }
        this.template = String.removeQueryString(template);

        this.parts = template.split(/\/|\./).filter(p => p !== '');
        if (this.parts.length > 0) {
            let indexOfPathExtensionStart = template.length - this.parts.last().length - 1;
            if (template.charAt(indexOfPathExtensionStart) === '.') {
                this.parts[this.parts.length - 1] = '.' + this.parts[this.parts.length - 1];
            }
        }

        for (let i in this.parts) {
            let part = this.parts[i];
            let isParameterPart = part.includes('{');
            let isExtensionPart = part.charAt(0) === '.';
            let params = isParameterPart ? part.replace(/{|}/g, '').split('|') : [];
            params = params.map(p => {
                return p.includes(':')
                    ? { name: p.split(':')[0], type: p.split(':')[1] }
                    : { name: p, type: 'string' };
            });
            params.forEach(p => {
                if (p.name.charAt(0) === '.') { p.name = p.name.substring(1); }
            });

            this.parts[i] = {
                value: isExtensionPart ? part.replace('.', '') : part,
                isExtension: isExtensionPart,
                isParam: isParameterPart,
                params: params
            };
        }

        this.queryStringParams = queryStringParams || [];
    }

    /**
     * Builds the relative path of the URI.
     * @param {object} params
     * @param {boolean} queryString
     * @returns {string}
     */
    relative(params, queryString) {
        params = params || {};
        queryString = (typeof queryString === 'undefined') ? true : queryString;
        // If the payload is not an object, its value belongs to the first route param
        if (typeof params !== 'object') {
            if (!this.parts.some(p => p.isParam)) {
                params = {};
            } else {
                let key = this.parts.find(p => p.isParam).params[0].name;
                let value = params;
                params = {};
                params[key] = value;
            }
        }

        let relativeUri = this.parts.map(part => {
            if (!part.isParam) {
                return part.isExtension ? '.' + part.value : '/' + part.value;
            }

            for (let partParam of part.params) {
                if (params.hasProp(partParam.name)) {
                    let v = params.getProp(partParam.name);
                    return part.isExtension ? '.' + v : '/' + v;
                }
            }

            throw new Error('Missing route parameters for ' + this.template);
        });

        relativeUri = relativeUri.join('');

        if (queryString === true) {
            queryString = {};
            for (let qsp of this.queryStringParams) {
                if (params.hasProp(qsp.name)) { queryString.setProp(qsp.name, params.getProp(qsp.name)); }
            }
        }

        if (typeof queryString === 'object') {
            relativeUri += Object.toQueryString(queryString);
        }

        return (relativeUri.length == 0) ? '/' : relativeUri;
    }

    /**
     * Builds the full path of the route (ex: https://www.news.com/articles/new-president?id=1).
     * @param {object} params
     * @param {boolean} queryString
     * @returns {string}
     */
    absolute(params, queryString) {
        return window.location.protocol + '//' + window.location.hostname + this.relative(params, queryString);
    }

    /**
     * Builds the canonical path of the route without a query string (ex: https://www.news.com/articles/new-president).
     * @param {object} params The route parameters.
     * @returns {string}
     */
    canonical(params) {
        return this.absolute(params, false);
    }

    /**
     * Determines if two URIs can have the same path.
     * @param {Uri} uri
     * @returns {boolean}
     */
    compare(uri) {
        // No match if they don't have the same amount of parts
        if (uri.parts.length != this.parts.length) { return false; }

        // Compare each part
        for (let i in this.parts) {
            if (uri.parts[i].isParam || this.parts[i].isParam) { continue; }
            if (uri.parts[i].value !== this.parts[i].value) { return false; }
        }

        return true;
    }
}