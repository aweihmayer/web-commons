/**
 * Creates a promise that will return the request body as an object.
 * Useful so that you can access the response body anywhere in the chain without needing to read asynchronously.
 * @param {Request} [request]
 * @returns {Promise<{ body: any, status: int, ok: boolean, method: string }>}
 */
Response.prototype.deserialize = async function (request) {
    const method = request.method || null;
    return this.json().then(
        data => ({
            body: data,
            status: this.status,
            ok: this.ok,
            method: method })
    );
};

/**
 * Mimics the deserialization of a response with a normal object.
 * Useful when you fetch things from a cache, but you still want to use the same code for your promise chains.
 * @param {object} body The data that mimics a response.
 * @param {string} [method] The HTTP method of the request.
 * @param {number} [code] The HTTP code of the response.
 * @returns {Promise<{ body: any, status: int, ok: true, method: string }>}
 */
Response.mimic = function (body, method, code) {
    return new Promise((resolve) => {
        resolve({
            body: body,
            status: code || 200,
            ok: true,
            method: method || 'GET' });
    });
};