class Route {
    /**
     * @param {string} name The route name which should be a JSON path. When adding with Routes.add(), you can retrieve them with that path.
     * @param {any} uri The URI template.
     * @param {any} method The HTTP method.
     * @param {any} [options]
     * @param {Function} [options.view] A function that returns a view to render.
     * @param {string[]} [options.bundles] Bundles to be loaded when the route changes.
     * @param {string} [options.cacheName] The cache name. Must be defined to enable the cache.
     * @param {number} [options.cacheDuration]
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
        this.cache = new RequestCacheValue(options.cacheName, options.cacheDuration);
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
        options = options ?? {};
        options.payload = payload;
        options.cache = this.cache;
        options.uri = this.uri;
        options.method = this.method;
        options.headers = new Headers();
        options.onResponse = Route.onFetchResponse;
        if (this.accept) { options.headers.append('Accept', this.accept); }
        if (this.contentType) { options.headers.append('Content-Type', this.contentType); }
        return Api.fetch(options);
    }

    goTo(params) {
        Router.goTo(this.uri.relative(params));
    }
}