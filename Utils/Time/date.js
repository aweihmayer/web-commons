/**
 * Gets the current unix timestamp in seconds
 * @returns {number}
 */
Date.unixTimestamp = () => (Math.floor(Date.now() / 1000));

Date.utcNow = () => new Date(Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate(),
    new Date().getUTCHours(),
    new Date().getUTCMinutes(),
    new Date().getUTCSeconds(),
    new Date().getUTCMilliseconds()
));