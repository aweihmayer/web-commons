/**
 * Retrieves a value from the cache.
 * @param {string} name
 * @param {number} [duration]
 * @returns {object|null} The cache data if it exists and is not expired, otherwise null.
 */
Storage.prototype.retrieve = function (name, duration) {
    let data = localStorage.getItem(name);
    CacheHelper.retrieve(data, duration);
};

/**
 * Caches an object and adds a timestamp to it.
 * @param {string} name
 * @param {any} data
 */
Storage.prototype.cache = function (name, data) {
    let cacheData = CacheHelper.toCacheFormat(data);
    cacheData = JSON.stringify(cacheData);
    localStorage.setItem(name, cacheData);
};

/**
 * Removes a value from the cache.
 * @param {string} name
 */
Storage.prototype.remove = function (name) {
    localStorage.removeItem(name);
};