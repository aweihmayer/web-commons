class Route {
    /**
     * 
     * @param {any} template The URI template.
     * @param {any} viewOrMethod The function that returns the view or the HTTP method.
     * @param {any} [options]
     * @param {string[]} [options.bundles] Bundles to be loaded when the route changes.
     * @param {string} [options.cache.name] The cache name. Must be defined to enable the cache.
     * @param {number} [options.cache.duration] The cache duration in milliseconds.
     * 
     */
    constructor(template, viewOrMethod, options) {
        options = options || {};
        this.template = template;
        this.name = null;
        this.bundles = options.bundles || [];

        this.cache = options.cache ? {} : null;
        this.cache.name = options.cache.name || null;
        this.cache.duration = options.cache.duration || null;

        if (typeof viewOrMethod == 'function') {
            this.view = viewOrMethod;
            this.method = 'GET';
        } else {
            this.view = null;
            this.method = viewOrMethod || 'GET';
        }
    }

    /**
     * Determines if this route matches a URL.
     * @param {string|string[]} url The URL or its parts.
     * @returns {boolean}
     */
    compare(url) {
        // Split the URL into parts
        if (!Array.isArray(url)) { url = url.getUrlParts(); }
        let template = this.template.getUrlParts();
        // No match if they don't have the same amount of parts
        if (url.length != template.length) { return false; }
        // Compare each part. Placeholder parts are wildcards
        for (let i = 0; i < url.length; i++) {
            let u = url[i];
            let t = template[i];
            if (t.includes('{')) { continue; }
            if (u != t) { return false; }
        }

        return true;
    }

    /**
     * Builds the relative path of the route (ex: /articles/new-president).
     * @param {object} params The route parameters.
     * @param {boolean} noQueryString
     * @returns {string}
     */
    path(params, noQueryString) {
        params = params || {};
        params = params.cloneObject(); // Clone the object to remove its reference
        params.deleteEmptyProps();

        // Used to track parameters used in the route path will not be duplicated in the query string
        let usedParams = [];

        let path = this.template.getUrlParts();

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
    fullPath(params, noQueryString) {
        return window.location.protocol + '://' + window.location.hostname + this.path(params, noQueryString);
    }

    /**
     * Builds the canonical path of the route without a query string (ex: https://www.news.com/articles/new-president).
     * @param {object} params The route parameters.
     * @returns {string}
     */
    canonicalPath(params) {
        return this.fullPath(params, true);
    }

    /**
     * Gets the route parameter names.
     * @returns {string[]}
     */
    getParamNames() {
        let names = [];
        let parts = this.template.getUrlParts();

        // For each URL part
        for (let part of parts) {
            // Skip if it is not a parameter
            if (!part.includes('{')) { continue; }
            // Read the parameters
            let partParams = part.replace(/{|}/g, '').split('|');
            // Add each parameter to the list if it hasn't already been
            for (let p of partParams) {
                if (!names.includes(p)) { names.push(partName); }
            }
        }

        return names;
    }

    /**
     * Gets the route parameters based on the current location.
     * @returns {object} Route parameters of the path and the query string.
     */
    getParams() {
        let path = window.location.pathname;

        // Convert query string to an object
        let params = path.queryStringToObj();
        path = path.removeQueryString();

        // We will go through the current location and the route template simultaneously
        let parts = path.getUrlParts();
        let parts2 = this.template.getUrlParts();

        // The route and the current location don't match
        if (parts.length !== parts2.length) { return params; }

        for (let i in parts2) {
            let p = parts[i];
            let p2 = parts2[i];

            // The part is not a parameter, skip it
            if (!p2.includes('{')) { continue; }
            // The part is a parameter, get the value from the current location
            let paramName = p2.replace(/{|}/g, '').split('|')[0];
            params[paramName] = p;
        }

        return params;
    }

    /**
     * Sends a request and returns the response.
     * @param {object} payload
     * @returns {Promise}
     */
    fetch(payload, options) {
        // If the payload is not an object, its value belongs to the first route param
        if (typeof payload !== 'object') {
            payload = {};
            let paramNames = this.getParamNames();
            if (paramNames.length > 0) { payload[paramNames][0] = payload; }
        }

        let request = this.request(payload);
        // TODO caching with headers

        return fetch(request, options)
            .then(response => response.deserialize(request))
            .then(response => {
                if (!response.ok) { throw response; }
                return response;
            });
    }

    /**
     * Builds a request.
     * @param {object} payload
     * @returns {Request}
     */
    request(payload) {
        payload = payload || {};
        let path = this.path(payload);
        return new Request(path, {
            method: this.method,
            body: (this.method == 'GET') ? null : JSON.stringify(payload)
        });
    }

    /**
     * Clears the cache of a request.
     * @param {object} payload
     */
    clearRequestCache(payload) {
        let request = route.request(payload);
        caches.open(this.cache.name)
            .then(cache => { cache.delete(request); });
    }

    /**
     * Clears the cache of an entire group of requests. 
     */
    clearGroupCache() {
        caches.delete(this.cache.name);
    }
}