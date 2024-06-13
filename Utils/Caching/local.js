/**
 * Defines a local storage value.
 * @param {string} name
 * @param {number} duration The cache duration in milliseconds.
 */
class LocalStorageValue {
    constructor(name, duration) {
        this.name = name;
        this.duration = duration;
    }

    /**
     * Retrieves a value from the cache.
     * @returns {object|null} The cache data if it exists and is not expired, otherwise null.
     */
    retrieve() {
        let data = localStorage.getItem(this.name);
        if (data == null) return null;
        else if (typeof data === 'string') data = JSON.parse(data);

        if (!this.duration || !data.cachedAt) {
            return data.data ?? data;
        } else if ((data.cachedAt + duration) < Date.now()) {
            this.clear();
            return null;
        } else {
            return data.data ?? data;
        }
    }

    /**
     * Caches an object and adds a timestamp to it.
     * @param {any} data
     */
    put(value) {
        const data = JSON.stringify({ data: value, cachedAt: Date.now()});
        localStorage.setItem(this.name, data);
    }

    /**
     * Removes a value from the cache.
     */
    clear() {
        localStorage.clear(this.name);
    }
}