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
     * Gets the route parameters based on a path.
     * @returns {object} Route parameters of the path and the query string.
     */
    getParams() {
        let uri = new Uri(window.location.pathname);
        let params = Object.fromQueryString(uri.template);
        uri.removeQueryString();

        // We will go through the current location and the route template simultaneously
        let parts = path.getUrlParts();
        let parts2 = this.parts;

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
            if (this.uri.paramNames.isEmpty()) {
                payload = {};
            } else {
                let key = this.uri.paramNames[0];
                let value = payload;
                payload = {};
                payload[key] = value;
            }
        }

        let request = this.buildRequest(payload);

        if (this.cache.name) {
            return caches.open(cache.name)
                .then(cache => cache.match(request))
                .then(response => {
                    if (response) {
                        if (!response.headers.has('Date') || !this.cache.duration) { return response; }
                        let responseUnixTimestamp = new Date(response.headers.get('Date')) / 1000;
                        if ((responseUnixTimestamp + this.cache.duration) >= Date.unixTimestamp()) { return response; }
                    }

                    return fetch(request, options)
                        .then(response => {
                            if (response.ok) { cache.put(request, response); }
                            return response;
                        });
                })
                .then(response => response.deserialize(request))
                .then(response => {
                    if (!response.ok) { throw response; }
                    return response;
                });
        }

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
    buildRequest(payload) {
        payload = payload || {};
        let path = this.uri.relative(payload);
        return new Request(path, {
            method: this.method,
            body: (this.method == 'GET') ? null : JSON.stringify(payload)
        });
    }

    /**
     * Clears the cache of a request.
     * @param {object} payload
     */
    clearCache(payload) {
        let request = route.buildRequest(payload);
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