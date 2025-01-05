class Route {
    /**
     * See the C# Route class.
     * @param {Function} [route.view] A function that returns a view to render.
     * @param {string[]} [route.bundles] Bundles to be loaded when the route changes.
     */
    constructor(route) {
        Object.assign(this, route);
        this.cache = new RequestCacheValue(route.cacheName, route.cacheDuration);
    }

    // #region HTTP

    buildRequest(options) {
        options = options ?? {};

        // Build headers
        let headers = new Headers();
        headers.append('Time-Offset', new Date().getTimezoneOffset() * -1);
        if (options.headers) Object.keys(options.headers).forEach(h => headers.append(h, options.headers[h]));
        if (this.accept) headers.append('Accept', this.accept);
        if (this.contentType) headers.append('Content-Type', this.contentType);

        // Assemble all the parts into a request object
        const request = new Request(this.getRelativeUri(options.params, options.query), {
            method: this.method ?? 'GET',
            body: options.payload ? JSON.stringify(payload) : null,
            headers: headers
        });

        request.requestCache = this.cache;
        return request;
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
        const templateParts = this.template.split('/').filter(x => x !== '');
        const uriParts = uri.split('/').filter(x => x !== '');

        if (templateParts.length !== uriParts.length) return false;

        for (let i in templateParts) {
            const t = templateParts[i];
            const u = uriParts[i];
            if (t.startsWith('{') && t.endsWith('}')) continue;
            if (t !== u) return false;
        }

        return true;
    }

    /**
     * Gets the route parameters based on a path.
     * @param {string} uri
     * @returns {object}
     */
    getParams(uri) {
        if (!this.matches(uri)) return {};
        let params = {};

        uri = uri ?? (window.location.relativeHref);
        let query = String.getQueryString(uri);
        query = Object.fromQueryString(query);
        uri = String.removeQueryString(uri);

        const templateParts = this.template.split('/');
        const uriParts = uri.split('/');

        for (let i in templateParts) {
            const t = templateParts[i];
            const u = uriParts[i];
            if (!t.startsWith('{') || !t.endsWith('}')) continue;
            const paramName = t.replace(/{|}/g, '').split(':').first();
            const param = this.routeParams.find(p => p.name === paramName);
            if (param) params[paramsName] = param.parse(u);
            else params.name = u;
        }

        Object.keys(query).forEach(k => {
            const param = this.queryParams.find(p => p.name === k);
            if (param) params[k] = param.parse(query[k]);
            else params[k] = query[k];
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
            if (!params.hasProp(p.name)) return;
            let v = params.getProp(p.name);
            let regex = new RegExp('{' + p.name + '.*?}');
            uri = uri.replace(regex, v);
            params.deleteProp(p.name);
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