/**
 * Defines standard functions for caching. 
 */
const CacheHelper = {
    /**
     * Parses and verifies the expiration of cached data.
     * @param {string} data
     * @param {number} [duration]
     * @returns {any} The data or null if it was empty or expired.
     */
    retrieve: function (data, duration) {
        if (data == null) { return null; }
        if (typeof data === 'string') { data = JSON.parse(data); }
        if (CacheHelper.isExpired(data, duration)) { return null; }
        return data.data ?? data;
    },

    /**
     * Determines if the data is expired.
     * @param {{ data: any, cachedAt: number }} data
     * @param {number} [duration]
     * @returns {boolean}
     */
    isExpired: function (data, duration) {
        if (!duration || !data.cachedAt) { return false; }
        return ((data.cachedAt + duration) < Date.now());
    },

    /**
     * Converts the data into a standard object with the current timestamp.
     * @param {any} data
     * @returns {{ data: any, cachedAt: number }}
     */
    toCacheFormat: function (data) {
        return { data: data, cachedAt: Date.now() };
    }
};