class Uri {
    constructor(template) {
        this.template = template;

        this.parts = template.split(/\/|\./).filterEmpty();

        this.paramNames = [];
        for (let part of this.parts) {
            // Skip if it is not a parameter
            if (!part.includes('{')) { continue; }
            // Read the parameters
            let partParams = part.replace(/{|}/g, '').split('|');
            // Add each parameter to the list if it hasn't already been
            for (let p of partParams) {
                if (!this.paramNames.includes(p)) { this.paramNames.push(partName); }
            }
        }
    }

    /**
     * Builds the relative path of the URI.
     * @param {object} params
     * @param {boolean} noQueryString
     * @returns {string}
     */
    relative(params, noQueryString) {
        params = params || {};
        params = Object.clone(params);
        Object.deleteEmptyProperties(params);

        // Used to track parameters used in the route path will not be duplicated in the query string
        let usedParams = [];

        let path = this.parts;

        // For each part of the path
        for (let i in path) {
            let part = path[i];
            // If the part is a not placeholder, keep it as is
            if (!part.includes('{')) { continue; }
            // Get the possible part params
            let partParams = pathParts[i].replace(/{|}/g, '').split('|');
            // Replace it with a value
            for (let p of partParams) {
                if (!params.hasProp(p)) { continue; }
                path[i] = params.getProp(p);
                usedParams.push(p);
                break;
            }
        }

        // Join the path array back into an URL
        let url = '';
        for (let part of path) {
            // If the part is an extension, it is precended by a period
            if (['json', 'xml', 'html', 'jpg', 'png', 'gif'].includes(part)) {
                url += '.' + part;
            } else {
                url += '/' + part;
            }
        }

        path = url;

        // Remove parameters used in the route path so that they are no duplicated in the query string
        for (let usedParam of usedParams) {
            params.deleteProp(usedParam);
        }

        // Add remaining parameters as query string
        noQueryString = (typeof noQueryString !== 'undefined') ? noQueryString : (this.method != 'GET');
        if (!noQueryString) { path += params.toQueryString(); }

        // Throw an error if some placeholder have not been replaced
        if (path.includes('{')) { throw new Error('Missing route parameters for ' + this.name); }

        // The first character of the URL should be a forward slash
        if (path.length == 0) { return '/'; }
        if (path.charAt(0) != '/') { return '/' + path; }

        return path;
    }

    /**
     * Builds the full path of the route (ex: https://www.news.com/articles/new-president?id=1).
     * @param {object} params The route parameters.
     * @param {boolean} noQueryString
     * @returns {string}
     */
    absolute(params, noQueryString) {
        return window.location.protocol + '://' + window.location.hostname + this.path(params, noQueryString);
    }

    /**
     * Builds the canonical path of the route without a query string (ex: https://www.news.com/articles/new-president).
     * @param {object} params The route parameters.
     * @returns {string}
     */
    canonical(params) {
        return this.absolute(params, true);
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
        for (let i = 0; i < uri.parts.length; i++) {
            let u = uri.parts[i];
            let t = this.parts[i];
            // Placeholder parts are wildcards
            if (t.includes('{')) { continue; }
            if (u != t) { return false; }
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