class Uri {
    constructor(template, queryStringParams) {
        if (template.length === 0 || template.charAt(0) !== '/') { template = '/' + template; }
        this.template = Object.removeQueryString(template);

        this.parts = template.split(/\/|\./).filter(p => p !== '');
        let indexOfPathExtensionStart = template.length - this.parts.length - 1;
        if (template.charAt(indexOfPathExtensionStart) === '.') {
            this.parts[this.parts.length - 1] = '.' + this.parts[this.parts.length - 1];
        }

        for (let i in this.parts) {
            let part = this.parts[i];
            let isParameterPart = part.includes('{');
            let isExtensionPart = part.charAt(0) === '.';
            let params = isParameterPart ? part.replace(/{|}/g, '').split('|') : [];
            params = params.map(p => {
                return p.includes(':')
                    ? { name: p, type: p.split(':')[1] }
                    : { name: p, type: 'string' };
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

        let relativeUri = this.parts.map(part => {
            if (part.isExtension) { return '.' + part.value; }
            if (!part.isParam) { return '/' + part.value; }
            for (let partParam of part.params) {
                if (part.hasProp(partParam.name)) { return '/' + part.getProp(p); }
            }

            throw new Error('Missing route parameters for ' + this.name);
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

    // TODO wtf
    /**
     * Gets the query string from the template.
     * @returns {string}
     */
    getQueryString() {
        if (this.template.includes('?')) { return ''; }
        return this.template.substring(this.template.indexOf('?'));
    }

    /**
    * Removes the query string from the template.
    * @returns {string}
    */
    removeQueryString() {
        this.template = this.template.split('?')[0];
    }
}