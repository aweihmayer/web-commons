class Uri {
    constructor(template, queryStringParams) {
        // Initialize properties
        if (template.length === 0 || template.charAt(0) !== '/') { template = '/' + template; }
        this.template = String.removeQueryString(template);
        this.parts = [];
        this.params = [];
        this.params.getUri = function (name) { return this.filter(p => p.name === name && p.location === 'uri'); }
        this.params.getUriParams = function () { return this.filter(p => p.location === 'uri'); }
        this.params.hasUriParams = function () { return this.getUriParams().any(); }
        this.params.getFirstUriParam = function () { return this.getUriParams().first(); }
        this.params.getQuery = function (name) { return this.filter(p => p.name === name && p.location === 'query'); }
        this.params.getQueryParams = function () { return this.filter(p => p.location === 'query'); }
        this.params.hasQueryParams = function () { return this.getQueryParams().any(); }
        this.params.getFirstQueryParam = function () { return this.getQueryParams().first(); }

        // Build parts
        let parts = template.split(/\/|\./).filter(p => p !== '');

        // Since we split the parts with slashes and dots, we need to readd a dot at the
        // last part in order to detect if it is an extension
        if (parts.length > 0) {
            let indexOfPathExtensionStart = template.length - parts.last().length - 1;
            if (template.charAt(indexOfPathExtensionStart) === '.') {
                parts[parts.length - 1] = '.' + parts[parts.length - 1];
            }
        }

        parts.forEach(part => {
            let newPart = {
                isExtension: part.charAt(0) === '.',
                isParam: part.includes('{'),
                params: []
            };

            newPart.value = newPart.isExtension ? part.replace('.', '') : part;

            if (!newPart.isParam) {
                this.parts.push(newPart);
                return;
            }

            part.replace(/{|}/g, '').split('|').forEach(p => {
                let newParam = { name: p, type: 'string', location: 'uri' };

                if (p.includes(':')) {
                    newParam.name = p.split(':')[0];
                    newParam.type = p.split(':')[1];
                }

                if (newParam.name.charAt(0) === '.') {
                    newParam.name = newParam.name.substring(1);
                }

                newPart.params.push(newParam.name);
                this.params.push(newParam);
            });

            this.parts.push(newPart);
        });

        if (typeof queryStringParams !== 'undefined') {
            queryStringParams.forEach(p => {
                this.params.push({
                    name: p.name, type: p.type, location: 'query'
                });
            });
        }
    }

    /**
     * Builds the relative path of the URI.
     * @param {object} params
     * @param {boolean} queryString
     * @returns {string}
     */
    relative(params, queryStringParams) {
        params = params || {};
        queryStringParams = queryStringParams || {};

        // If the payload is not an object, its value belongs to the first route param
        if (typeof params !== 'object') {
            if (!this.params.hasUriParams()) {
                params = {};
            } else {
                let key = this.params.getFirstUriParam().name;
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
                if (params.hasProp(partParam)) {
                    let v = params.getProp(partParam);
                    v = Parser.parse(v, 'string');
                    return part.isExtension ? '.' + v : '/' + v;
                }
            }
            
            throw new Error('Missing route parameter ' + this.params.getFirstUriParam().name + ' for ' + this.template);
        });

        relativeUri = relativeUri.join('');

        let queryString = {};
        if (typeof queryStringParams === 'string') {
            relativeUri += queryStringParams;
        } else if (typeof queryStringParams === 'object') {
            this.params.getQueryParams().forEach(p => {
                if (!queryStringParams.hasProp(p.name)) { return; }
                let v = queryStringParams.getProp(p.name);
                v = Parser.parse(v, 'string');
                queryString.setProp(p.name, v);
            });

            if (Object.keys(queryString).any()) {
                relativeUri += Object.toQueryString(queryString);
            }
        }

        return (relativeUri.length === 0) ? '/' : relativeUri;
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