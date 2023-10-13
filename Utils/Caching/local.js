﻿/**
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
        let item = CacheHelper.retrieve(data, this.duration);
        if (item == null) { localStorage.removeItem(this.name); }
        return item;
    }

    /**
     * Caches an object and adds a timestamp to it.
     * @param {any} data
     */
    put(value) {
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