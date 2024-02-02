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
    constructor(name, template, method, options) {
        options = options || {};
        this.name = name;
        this.method = method;
        this.accept = options.accept || null;
        this.contentType = options.contentType || null;
        this.view = options.view || null;
        this.bundles = options.bundles || [];
        this.cache = new RequestCacheValue(options.cacheName, options.cacheDuration);

        this.template = String.removeQueryString(template) || '/';
        if (this.template.charAt(0) != '/') this.template = '/' + this.template;
        this.params = [];

        // Build params
        const uriParams = this.template.match(/{.*?}/g) ?? [];
        this.params = uriParams.map(p => {
            p = p.replace(/{|}/g, '');
            return {
                name: p.split(':')[0],
                type: p.split(':')[1] ?? 'string',
                location: 'uri'
            };
        });

        if (typeof options.queryStringParams === 'undefined') return;
        options.queryStringParams.forEach(p => {
            this.params.push({
                name: p.name,
                type: p.type,
                location: 'query'
            });
        });
    }

    // #region HTTP

    static onFetchResponse = response => response;

    fetch(payload, options) {
        options = options ?? {};
        options.payload = payload;
        options.cache = this.cache;
        options.method = this.method;
        options.headers = new Headers();
        options.onResponse = Route.onFetchResponse;
        if (this.accept) options.headers.append('Accept', this.accept);
        if (this.contentType) options.headers.append('Content-Type', this.contentType);
        return Http.fetch(this, options);
    }

    // #endregion

    // #region Routing

    goTo(params, query) {
        Router.goTo(this.getRelativeUri(params, query));
    }

    /**
     * Determines the route matches a URI.
     * @param {string} uri
     * @returns {boolean}
     */
    matches(uri) {
        uri = String.removeQueryString(uri);
        // Escape special characters in the URL pattern and replace wildcard with a regex wildcard
        const regexPattern = this.template.replace(/\//g, '\\/').replace(/\{.*?\}/g, '([\\w-]+)');
        const regex = new RegExp('^' + regexPattern + '$');
        return regex.test(uri);
    }

    /**
     * Gets the route parameters based on a path.
     * @param {string} uri
     * @returns {object}
     */
    getParams(uri) {
        if (!this.matches(uri)) return {};

        uri = uri ?? (window.location.relativeHref);
        let query = String.getQueryString(uri);
        uri = String.removeQueryString(uri);
        let params = {};

        const regexPattern = this.template.replace(/\//g, '\\/').replace(/\{([^{}]+)\}/g, '([^/]+)');
        const regex = new RegExp('^' + regexPattern + '$');
        const uriParams = uri.match(regex).slice(1);
        uriParams.forEach((v, i) => {
            let param = this.params[i];
            v = Parser.parse(v, param.type);
            params.setProp(param.name, v);
        })

        if (isEmpty(query)) return params;

        query = Object.fromQueryString(query);
        Object.keys(query).forEach(k => {
            let queryParam = this.params.find(p => p.name === k);
            if (!queryParam) params[k] = query[k];
            else params[k] = Parser.parse(query[k], queryParam.type);
        });

        return params;
    }

    // #endregion

    // #region URI

    /**
     * Builds the relative path of the URI.
     * @param {object} params
     * @param {boolean} query
     * @returns {string}
     */
    getRelativeUri(params, query) {
        params = params ?? {};
        query = query ?? {};

        // If the payload is not an object, its value belongs to the first route param
        if (typeof params !== 'object') {
            const firstUriParam = this.params.find(p => p.location === 'uri');
            if (!firstUriParam) params = {};
            else {
                let value = params;
                params = {};
                params[firstUriParam.name] = value;
            }
        }

        let uri = this.template;
        this.params.forEach(param => {
            if (param.location !== 'uri') return;
            else if (!params.hasProp(param.name)) return;
            let v = params.getProp(param.name);
            v = Parser.parse(v, 'string');
            let regex = new RegExp('{' + param.name + '.*?}');
            uri = uri.replace(regex, v);
        });

        if (uri.includes('{')) throw new Error('Missing route parameter for ' + this.template);
        else if (typeof query === 'string') {
            return uri + query;
        } else if (typeof query === 'object') {
            let parsedQuery = {};
            Object.keys(query).forEach(k => {
                if (typeof query[k] === 'object') return;
                let v = query[k];
                v = Parser.parse(v, 'string');
                parsedQuery[k] = v;
            });

            return uri + Object.toQueryString(parsedQuery);
        } else {
            return uri;
        }
    }

    /**
     * Builds the full path of the route (ex: https://www.news.com/articles/new-president?id=1).
     * @param {object} params
     * @param {boolean} queryString
     * @returns {string}
     */
    getAbsoluteUri(params, queryString) {
        return `${window.location.protocol}//${window.location.hostname}${this.getRelativeUri(params, queryString)}`;
    }

    /**
     * Builds the canonical path of the route without a query string (ex: https://www.news.com/articles/new-president).
     * @param {object} params The route parameters.
     * @returns {string}
     */
    getCanonicalUri(params) {
        return this.getAbsoluteUri(params, false);
    }

    // #endregion
}