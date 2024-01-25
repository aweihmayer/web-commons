class RequestCacheValue {
    constructor(name, duration) {
        this.name = name;
        this.duration = duration;
    }

    get isEnabled() {
        return (this.name != null);
    }

    put(request, response) {
        return caches.open(this.name).then(cache => {
            let clonedResponse = response.clone();
            cache.put(request, response);
            return clonedResponse.deserialize(request);
        });
    }

    retrieve(request) {
        return caches.open(this.name)
            .then(cache => cache.match(request))
            .then(cachedResponse => {
                if (!cachedResponse) {
                    return Http.fetch({ request: request, cache: this, noCache: true });
                } else if (!this.duration) {
                    return cachedResponse.deserialize(request);
                } else if (!cachedResponse.isExpired(this.duration)) {
                    return cachedResponse.deserialize(request);
                } else {
                    return Http.fetch({ request: request, cache: this, noCache: true });
                }
            });
    }

    clear(request) {
        if (isEmpty(request)) {
            return caches.delete(this.name);
        } else if (request instanceof Request) {
            return caches.open(this.name).then(cache => { cache.delete(request); });
        }
    }
}