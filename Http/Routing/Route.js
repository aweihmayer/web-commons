class Route {
    /**
     * See the C# Route class.
     * @param {Function} [route.view] A function that returns a view to render.
     * @param {string[]} [route.bundles] Bundles to be loaded when the route changes.
     */
    constructor(route, template, method, options) {
        Object.assign(this, route);
        this.cache = new RequestCacheValue(options.cacheName, options.cacheDuration);

        this.template = String.removeQueryString(template) || '/';
        if (this.template.charAt(0) != '/') this.template = '/' + this.template;
        this.params = [];
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
     * @param {boolean} addQueryString
     * @returns {string}
     */
    getRelativeUri(params, addQueryString) {
        params = params ?? {};

        // If the payload is not an object, its value belongs to the first route param
        if (typeof params !== 'object') {
            if (!this.routeParams.any()) {
                params = {};
            } else {
                const firstRouteParam = this.routeParams.first();
                const temp = params;
                params = {};
                params[firstRouteParam] = temp;
            }
        }

        params = Object.clone(params);

        let uri = this.template;
        this.routeParams.forEach(p => {
            if (!params.hasProp(p)) return;
            let v = params.getProp(p);
            let regex = new RegExp('{' + param.name + '.*?}');
            uri = uri.replace(regex, v);
            params.deleteProp(p);
        });

        if (uri.includes('{')) {
            throw new Error('Missing route parameter for ' + this.template);
        } else if (!addQueryString) {
            return uri;
        } else {
            return uri + Object.toQueryString(params);
        }
    }

    /**
     * Builds the full path of the route (ex: https://www.news.com/articles/new-president?id=1).
     * @param {object} params
     * @param {boolean} query
     * @returns {string}
     */
    getAbsoluteUri(params, query) {
        return `${window.location.protocol}//${window.location.hostname}${this.getRelativeUri(params, query)}`;
    }

    /**
     * Builds the canonical path of the route without a query string (ex: https://www.news.com/articles/new-president).
     * @param {object} params
     * @returns {string}
     */
    getCanonicalUri(params) {
        return this.getAbsoluteUri(params, false);
    }

    // #endregion
}