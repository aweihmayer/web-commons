class Route {
    /**
     * @param {string} name The route name which should be a JSON path. When adding with Routes.add(), you can retrieve them with that path.
     * @param {any} uri The URI template.
     * @param {any} method The HTTP method.
     * @param {any} [options]
     * @param {Function} [options.view] A function that returns a view to render.
     * @param {string[]} [options.bundles] Bundles to be loaded when the route changes.
     * @param {string} [options.cache.name] The cache name. Must be defined to enable the cache.
     * @param {number} [options.cache.duration] The cache duration in milliseconds. TODO seconds
     * @param {Array<ValueSchema>} [options.queryStringParams]
     */
    constructor(name, uri, method, options) {
        options = options || {};
        this.name = name;
        this.uri = new Uri(uri, options.queryStringParams);
        this.method = method;
        this.view = options.view || null;
        this.bundles = options.bundles || [];
        this.cache = options.cache || null;

    }

    /**
     * Gets the route parameters based on a path.
     * @returns {object} Route parameters of the path and the query string.
     */
    getParams() {
        let uri = window.location.pathname;
        let params = Object.fromQueryString(uri);
        uri = new Uri(uri);

        // The route and the current location don't match
        if (uri.parts.length !== this.uri.parts.length) { return params; }

        for (let i in uri.parts) {
            // The part is not a parameter, skip it
            if (!this.uri.parts[i].isParam) { continue; }
            let result = Validator.validate(uri.parts[i].value, this.uri.parts[i].params[0]);
            params[this.uri.parts[i].params[0].name] = result.value;
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
            if (!this.uri.parts.some(p => p.isParam)) {
                payload = {};
            } else {
                let key = this.uri.find(p => p.isParam).params[0];
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
        let headers = new Headers();
        headers.append("Content-Type", "application/json");


        return new Request(path, {
            method: this.method,
            body: (this.method == 'GET') ? null : JSON.stringify(payload),
            headers: headers
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