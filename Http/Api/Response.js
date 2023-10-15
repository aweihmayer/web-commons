/**
 * Creates a promise that will return the request body as an object.
 * Useful so that you can access the response body anywhere in the chain without needing to read asynchronously.
 * @param {Request} [request]
 * @returns {Promise<{ body: any, status: int, ok: boolean, method: string }>}
 */
Response.prototype.deserialize = async function (request) {
    const method = request.method || null;
    return this.json().then(data => {
        this.json = data;
        this.method = method;
        return this;
    });
};

/**
 * Gets the date header value of a response.
 */
Response.prototype.getDateTimestamp = function () {
    return Date.parse(this.headers.get('Date'));
}

/**
 * Determines if the response is too stale to use based on the date header.
 */
Response.prototype.isExpired = function (duration) {
    return (this.getDateTimestamp() + duration) < Date.now();
};

/**
 * Mimics the deserialization of a response with a normal object.
 * Useful when you fetch things from a cache, but you still want to use the same code for your promise chains.
 * @param {object} body The data that mimics a response.
 * @param {string} [method] The HTTP method of the request.
 * @param {number} [code] The HTTP code of the response.
 * @returns {Promise<{ body: any, status: int, ok: boolean, method: string }>}
 */
Response.mimic = (body, method, code) => {
    code = code || 200;
    return new Promise((resolve) => {
        resolve({
            body: body,
            status: code,
            ok: (code >= 200 && code < 300),
            method: method || 'GET'
        });
    });
};