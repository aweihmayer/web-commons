/** 
 *  The list of routes.
 */
const Routes = {
    /**
     * Adds routes.
     * @param {Array<Route|object>} routes Route instances or a plain JSON config object.
     */
    add: function (routes) {
        if (!Array.isArray(routes)) { routes = [routes]; }

        for (let r of routes) {
            let route = r;
            if (!(route instanceof Route)) {
                route = new Route(route.name, route.uri, route.method, route);
            }

            this.setProp(route.name, route);
            this._routes.push(route);
        }
    },

    /**
     * Finds a route by name.
     * @param {any} name
     * @returns {Route}
     */
    find: function (name) { this._routes.find(r => r.name === name) },

    /**
     * Finds a match for a view route. We pick the route that has the least amount of uri parameters.
     * @param {any} uri
     */
    matchViewRoute: function (uri) {
        let matches = this._routes.filter(r => (r.method == 'GET' && r.view && r.uri.compare(uri)));
        if (!matches.any()) { return null; }
        return matches.sort((a, b) => (a.uri.params.getAllUri().length > b.uri.getAllUri().length)).first();
    },

    /**
     * A flattened list of all the routes.
     */
    _routes: []
};