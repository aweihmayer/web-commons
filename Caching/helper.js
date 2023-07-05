/**
 * Defines standard functions for caching.
 * The duration is in milliseconds.
 */
const CacheHelper = {
    /**
     * Parses and verifies the expiration of cached data.
     * @param {{ data: any, cachedAt: number }} data
     * @param {number} [duration]
     * @returns {any} The data or null if it was empty or expired.
     */
    retrieve: function (data, duration) {
        if (data == null) { return null; }
        data = JSON.parse(data);
        return CacheHelper.isExpired(data, duration) ? null : data;
    },

    /**
     * Determines if the data is expired.
     * @param {{ data: any, cachedAt: number }} data
     * @param {number} [duration]
     * @returns {boolean} True if the data is expired, otherwise false if it isn't or if there is no timestamp or duration.
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