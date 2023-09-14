﻿class LocalStorageValue {
    /**
     * @param {string} name
     * @param {number} duration The duration of the cookie in seconds.
     * @param {string} type TODO the type to serialize/deserialize
     */
    constructor(name, duration, type) {
        this.name = name;
        this.duration = duration;
        this.type = type;
    }

    /**
     * Retrieves a value from the cache.
     * @returns {object|null} The cache data if it exists and is not expired, otherwise null.
     */
    retrieve() {
        let data = localStorage.getItem(this.name);
        let item = CacheHelper.retrieve(data, this.duration);
        if (item == null) { localStoage.removeItem(this.name); }
        return item;
    }

    /**
     * Caches an object and adds a timestamp to it.
     * @param {any} data
     */
    cache(value) {
        value = CacheHelper.toCacheFormat(value);
        value = JSON.stringify(value);
        localStorage.setItem(this.name, value);
    }

    /**
     * Removes the value from the cache.
     */
    clear() {
        localStorage.clear(this.name);
    }
}