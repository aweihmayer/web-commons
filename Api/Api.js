class Api {
    /**
     * @param {Store} store The default store to use.
     */
    constructor(store) {
        this.store = store;
    }

    /**
     * Find one item and adds it to the store.
     * @param {Route} route
     * @param {any} query
     * @param {Store} store
     * @returns {Promise<Response>}
     */
    findWithStore(route, query, store) {
        store = (store ? store : this.store);
        let item = store.find(query);
        if (item != null) { return Response.mimic(item); }
        return route.fetch(query)
            .then(response => {
                store.add(response.body);
                return response; });
    }

    /**
     * Fetches many items and adds them to the store.
     * @param {Route} route
     * @param {any} query
     * @param {Store} store
     * @returns {Promise<Response>}
     */
    fetchAllWithStore(route, query, store) {
        store = (store ? store : this.store);
        return route.fetch(query)
            .then(response => {
                store.add(response.body);
                return response; });
    }

    /**
     * Creates or updates an item and adds it to the store.
     * @param {Route} route
     * @param {any} payload
     * @param {Store} store
     * @returns {Promise<Response>}
     */
    saveWithStore(route, payload, store) {
        store = (store ? store : this.store);
        return route.fetch(payload)
            .then(response => {
                store.add(response.body);
                return response; });
    }

    /**
     * Deletes an item and removes it from the store.
     * @param {Route} route
     * @param {any} payload
     * @param {Store} store
     * @returns {Promise<Response>}
     */
    deleteWithStore(route, payload, store) {
        store = (store ? store : this.store);
        return route.fetch(payload)
            .then(response => {
                store.remove(payload);
                return response; });
    }
}