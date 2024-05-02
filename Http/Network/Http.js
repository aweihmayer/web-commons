class Http {
    /**
     * Creates a request object.
     * @param {string|Route|Request} uri
     * @param {object} options
     * @returns {Request}
     */
    static buildRequest(uri, options) {
        // Return the request if it was already built
        if (uri instanceof Request) return uri;

        // Build payload
        let payload = {};
        if (typeof options.payload === 'object') {
            payload = options.payload;
        // If the payload is not an object, it represents the first route param
        } else if (uri instanceof Route && !isUndefined(options.payload)) {
            const firstUriParam = uri.params.find(p => p.location === 'uri');
            if (!firstUriParam) payload = {};
            else payload[firstUriParam.name] = options.payload;
        } 

        // Build uri
        let requestUri = '';
        if (typeof uri === 'string') requestUri = options.uri;
        else if (uri instanceof Route) requestUri = uri.getRelativeUri(payload);

        // Build headers
        let headers = new Headers();
        if (options.headers instanceof Headers) {
            headers = options.headers;
        } else {
            for (let h in options.headers) headers.append(h, options.headers[h]);
        }

        headers.append('Time-Offset', new Date().getTimezoneOffset() * -1);

        // Assemble all the parts into a request object
        let method = options.method ?? 'GET';
        return new Request(requestUri, {
            method: method,
            body: (method == 'GET') ? null : JSON.stringify(payload),
            headers: headers
        });
    }

    /**
     * Fetches a HTTP request.
     * @param {string|Route|Request} uri
     * @param {object} options
     * @returns {Promise<Response>}
     */
    static fetch(uri, options) {
        options.uri = uri;
        let request = Http.buildRequest(uri, options);

        // Cache
        let cache = null;
        if (options.cache instanceof RequestCacheValue) {
            cache = options.cache;
        } else if (options.cacheName || options.cacheDuration) {
            cache = new RequestCacheValue(options.cacheName, otions.cacheDuration);
        }

        if (cache && cache.isEnabled && !options.noCache) return cache.retrieve(request);

        return fetch(request)
            .then(response => {
                // A callback is defined, call it
                if (typeof options.onResponse === 'function') return options.onResponse(response);
                // Otherwise return the response
                else return response;
            }).then(response => {
                // Retry the request
                if (response.retry) return Http.fetch(request);
                // The cache is defined, cache the response
                else if (cache && cache.isEnabled) return cache.put(request, response);
                // Otherwise return the deserializedd response
                else return response.deserialize(request);
            }).then(response => {
                if (options.uri instanceof Route) response.route = options.uri.name;

                if (!response.ok) throw response;
                else return response;
            });
    }
}