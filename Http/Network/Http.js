class Http {
    static onResponse = response => response;

    /**
     * Fetches a HTTP request.
     * @param {Request} request
     * @param {object} options
     * @returns {Promise<Response>}
     */
    static fetch(request, options) {
        options = options ?? {};
        if (request.requestCache && request.requestCache.isEnabled && !options.noCache) return request.requestCache.retrieve(request);

        return fetch(request)
            .then(response => {
                return Http.onResponse(response);
            }).then(response => {
                // Retry the request
                if (response.retry) return Http.fetch(request);
                // The cache is defined, cache the response
                else if (request.requestCache && request.requestCache.isEnabled) return request.requestCache.put(request, response);
                // Otherwise return the deserialized response
                else return response.deserialize(request);
            }).then(response => {
                if (options.uri instanceof Route) response.route = options.uri.name;

                if (!response.ok) throw response;
                else return response;
            });
    }
}