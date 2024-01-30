class Http {
    static buildRequest(uri, options) {
        if (uri instanceof Request) return uri;

        // Payload
        let payload = {};
        if (typeof options.payload !== 'object') {
            if (uri instanceof Route && uri.params.some(p => p.type === 'uri')) {
                let firstUriParamName = uri.params.find(p => p.type === 'uri').name;
                payload[firstUriParamName] = options.payload;
            }
        } else {
            payload = options.payload;
        }

        // Uri
        let requestUri = '';
        if (typeof uri === 'string') requestUri = options.uri;
        else if (uri instanceof Route) requestUri = uri.getRelativeUri(payload);

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
        return new Request(requestUri, {
            method: method,
            body: (method == 'GET') ? null : JSON.stringify(payload),
            headers: headers
        });
    }

    static fetch(uri, options) {
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