class Uri {
    constructor(template, allowedQueryStringParams) {
        if (template.length === 0 || template.charAt(0) !== '/') { template = '/' + template; }
        this.template = template;

        this.parts = template.split(/\/|\./).filter(p => p !== '');
        let indexOfPathExtensionStart = template.length - this.parts.length - 1;
        if (template.charAt(indexOfPathExtensionStart) === '.') {
            this.parts[this.parts.length - 1] = '.' + this.parts[this.parts.length - 1];
        }

        for (let i in this.parts) {
            let part = this.parts[i];
            let isParameterPart = part.includes('{');
            let isExtensionPart = part.charAt(0) === '.';
            this.parts[i] = {
                value: isExtensionPart ? part.replace('.', '') : part,
                isExtension: isExtensionPart,
                isParam: isParameterPart,
                params: isParameterPart ? part.replace(/{|}/g, '').split('|') : null
            };
        }

        this.allowedQueryStringParams = allowedQueryStringParams || [];
    }

    /**
     * Builds the relative path of the URI.
     * @param {object} params
     * @param {boolean} queryStringParams TODO
     * @returns {string}
     */
    relative(params, queryStringParams) {
        params = params || {};
        queryStringParams = (typeof queryStringParams === 'undefined') ? true : queryStringParams;

        let relativeUri = this.parts.map(p => {
            if (p.isExtension) { return '.' + p.value; }
            if (!p.isParam) { return '/' + p.value; }
            for (let partParam of p.params) {
                if (p.hasProp(partParam)) { return '/' + p.getProp(p); }
            }

            throw new Error('Missing route parameters for ' + this.name);
        });

        relativeUri = relativeUri.join('');

        if (queryStringParams === true) {
            queryStringParams = {};
            for (var k of this.allowedQueryStringParams) {
                if (params.hasProp(k)) { queryStringParams.setProp(k, params.getProp(k)); }
            }
        } else if (typeof queryStringParams === 'object') {
            relativeUri += Object.toQueryString(queryStringParams);
        }

        return (relativeUri.length == 0) ? '/' : relativeUri;
    }

    /**
     * Builds the full path of the route (ex: https://www.news.com/articles/new-president?id=1).
     * @param {object} params
     * @param {boolean} queryStringParams
     * @returns {string}
     */
    absolute(params, queryStringParams) {
        return window.location.protocol + '//' + window.location.hostname + this.relative(params, queryStringParams);
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