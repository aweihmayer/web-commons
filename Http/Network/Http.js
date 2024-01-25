class Http {
    static buildRequest(options) {
        if (options instanceof Request) return options;
        else if (options.request instanceof Request) return options.request;

        // Uri
        let uri = new Uri('');
        if (typeof options.uri === 'string') uri = new Uri(options.uri);
        else if (options.uri instanceof Uri) uri = options.uri;
        else if (options.uri instanceof Route) uri = options.uri.uri;

        // Payload
        let payload = {};
        if (typeof options.payload !== 'object') {
            if (uri.params.hasUri()) {
                let firstUriParamName = uri.params.getFirstUri().name;
                payload[firstUriParamName] = options.payload;
            }
        } else {
            payload = options.payload;
        }

        // Headers
        let headers = new Headers();
        if (options.headers instanceof Headers) {
            headers = options.headers;
        } else {
            for (let h in options.headers) headers.append(h, options.headers[h]);
        }

        headers.append('Time-Offset', new Date().getTimezoneOffset() * -1);

        // Fetch
        let method = options.method ?? 'GET';
        let path = uri.relative(payload);
        return new Request(path, {
            method: method,
            body: (method == 'GET') ? null : JSON.stringify(payload),
            headers: headers
        });
    }

    static fetch(options) {
        let request = Http.buildRequest(options);

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
                if (typeof options.onResponse !== 'function') return response;
                else return options.onResponse(response);
            }).then(response => {
                if (response.retry) return Http.fetch(request);
                else if (cache && cache.isEnabled) return cache.put(request, response);
                else return response.deserialize(request);
            }).then(response => {
                if (options.uri instanceof Route) response.route = options.uri.name;

                if (!response.ok) throw response;
                else return response;
            });
    }
}