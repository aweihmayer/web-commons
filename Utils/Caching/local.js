/**
 * Defines a local storage value.
 * @param {string} name
 * @param {number} duration
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
        value = { data: value, cachedAt: Date.now() };
        value = JSON.stringify(value);
        localStorage.setItem(this.name, value);
    }

    /**
     * Removes a value from the cache.
     */
    clear() {
        localStorage.clear(this.name);
    }

    /**
     * Removes all keys from the local storage.
     */
    static clear() {
        localStorage.clear();
    }
}