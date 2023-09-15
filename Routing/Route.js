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
        this.accept = options.accept || null;
        this.contentType = options.contentType || null;
        this.view = options.view || null;
        this.bundles = options.bundles || [];

        this.cache = options.cache || {};
        /**
        * Clears the cache of a request.
        * @param {object} payload
        */
        this.cache.clear = (payload) => {
            let request = route.buildRequest(payload);
            caches.open(this.cache.name).then(cache => { cache.delete(request); });
        };
        this.cache.clear.bind(this);

        /**
         * Clears the cache of an entire group of requests. 
         */
        this.cache.clearGroup = () => {
            caches.delete(this.cache.name);
        }
        this.cache.clearGroup.bind(this);
    }

    /**
     * Gets the route parameters based on a path.
     * @returns {object} Route parameters of the path and the query string.
     */
    getParams() {
        if (Router.current.route.name !== this.name) { throw new Error('Can only call get params on the current route'); }

        let uri = window.location.pathname;
        let params = Object.fromQueryString(uri);
        for (let k in params) {
            let queryParamSchema = this.uri.queryStringParams.find(q => q.name === k);
            if (queryParamSchema === null) { continue; }

        }

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
    fetch(payload) {
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
                        if (!this.cache.duration) { return response; }
                        if ((response.getDateTimestamp() + this.cache.duration) >= Date.unixTimestamp()) { return response; }
                    }

                    return fetch(request)
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

        return fetch(request)
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
        if (this.accept) { headers.append("Accept", this.accept); }
        if (this.contentType) { headers.append("Content-Type", this.contentType); }


        return new Request(path, {
            method: this.method,
            body: (this.method == 'GET') ? null : JSON.stringify(payload),
            headers: headers
        });
    }
}