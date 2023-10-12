class Route {
    /**
     * @param {string} name The route name which should be a JSON path. When adding with Routes.add(), you can retrieve them with that path.
     * @param {any} uri The URI template.
     * @param {any} method The HTTP method.
     * @param {any} [options]
     * @param {Function} [options.view] A function that returns a view to render.
     * @param {string[]} [options.bundles] Bundles to be loaded when the route changes.
     * @param {string} [options.cache.name] The cache name. Must be defined to enable the cache.
     * @param {number} [options.cache.duration]
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
        this.cache.isEnabled = (this.cache.name != null);
        this.cache.put = function (request, response) {
            return caches.open(this.name).then(cache => {
                let clonedResponse = response.clone();
                cache.put(request, response);
                return clonedResponse.deserialize(request);
            });
        };
        this.cache.clear = function (payload) {
            let request = route.buildRequest(payload);
            return caches.open(this.name).then(cache => { cache.delete(request); });
        };
        this.cache.clearGroup = function () {
            return caches.delete(this.name);
        };
    }

    /**
     * Gets the route parameters based on a path.
     * @returns {object}
     */
    getParams(href) {
        href = href || (window.location.pathname + window.location.search);
        let params = {};

        // Get query string params
        if (href.includes('?')) {
            params = Object.fromQueryString(href);
            Object.keys(params).forEach(p => {
                let queryParamSchema = this.uri.params.getQuery(p);
                if (queryParamSchema == null) { return; }
                params[p] = Parser.parse(params[p], queryParamSchema.type);
            });
        }

        let uri = new Uri(href);
        if (!uri.compare(this.uri)) { return {}; }

        uri.parts.forEach((p, i) => {
            // The part is not a parameter, skip it
            if (!this.uri.parts[i].isParam) { return; }
            this.uri.parts[i].params.forEach(p2 => {
                try {
                    let paramSchema = this.uri.params.getUri(p2);
                    let v = Parser.parse(p.value, paramSchema.type);
                    params.setProp(p2, v);
                } catch { }
            });
        });

        return params;
    }

    static onFetchResponse = response => response;

    fetch(payload, options) {
        options = options || {};
        let request = this.buildRequest(payload);

        if (this.cache.isEnabled && !options.noCache) {
            return caches.open(this.cache.name)
                .then(cache => cache.match(request))
                .then(cachedResponse => {
                    if (cachedResponse) {
                        if (!this.cache.duration) {
                            return cachedResponse.deserialize(request);
                        } else if (cachedResponse.isExpired(this.cache.duration)) {
                            return cachedResponse.deserialize(request);
                        }
                    }

                    return this.fetch(request, { noCache: true });
                });
        }

        return fetch(request)
            .then(response => {
                response.route = this.name;
                return Route.onFetchResponse(response);
            })
            .then(response => {
                if (response.retry) {
                    return this.fetch(request);
                } else if (this.cache.isEnabled) {
                    return this.cache.put(request, response);
                } else {
                    return response.deserialize(request);
                }
            })
            .then(response => {
                if (!response.ok) { throw response; }
                return response;
            });
    }

    static onFetchResponse = response => response;

    buildRequest(payload) {
        payload = payload || {};
        // If the payload is not an object, its value belongs to the first route param
        if (typeof payload !== 'object') {
            if (!this.uri.params.hasUri()) {
                payload = {};
            } else {
                let key = this.uri.params.getFirstUri().name;
                let value = payload;
                payload = {};
                payload[key] = value;
            }
        } else if (payload instanceof Request) {
            return payload;
        }

        let path = this.uri.relative(payload);

        let headers = new Headers();
        headers.append('Time-Offset', new Date().getTimezoneOffset() * -1);
        if (this.accept) { headers.append('Accept', this.accept); }
        if (this.contentType) { headers.append('Content-Type', this.contentType); }

        return new Request(path, {
            method: this.method,
            body: (this.method == 'GET') ? null : JSON.stringify(payload),
            headers: headers
        });
    }

    goTo(params) {
        Router.goTo(this.uri.relative(params));
    }
}