/** 
 *  The list of routes.
 */
const Routes = {
    /**
     * Adds routes.
     * @param {Array<Route|object>} routes Route instances or a plain JSON config object.
     */
    add: function (routes) {
        if (!Array.isArray(routes)) routes = [routes];

        for (let r of routes) {
            let route = r;
            if (!(route instanceof Route)) {
                route = new Route(route.name, route.uri, route.method, route);
            }

            this.setProp(route.name, route);
            this._routes.push(route);
        }

        this.setGroupFunctions();
    },

    setGroupFunctions(routes) {
        routes = routes ?? this;
        if (typeof routes !== 'object') return;
        if (routes instanceof Route) return;
        routes.toArray = function () {
            let routes = [];
            for (let k in this) {
                if (this[k] instanceof Route) { routes.push(this[k]); }
                else if (typeof this[k] === 'object') { routes = routes.concat(this[k].toArray()); }
            }

            return routes;
        };

        routes.clearCaches = function () {
            let routes = this.toArray();
            return Promise.all(routes.map(r => r.cache.clear()));
        }

        for (let k in routes) this.setGroupFunctions(routes[k]);
    },

    /**
     * Finds a route by name.
     * @param {any} name
     * @returns {Route}
     */
    find: function (name) { this._routes.find(r => r.name === name) },

    getViews: function () { return this._routes.filter(r => (r.method == 'GET' && r.view)); },

    /**
     * Finds a match for a view route.
     * @param {string} uri
     * @returns {Route}
     */
    getView: function (uri) {
        let matches = this.getViews().filter(r => r.matches(uri));
        if (!matches.any()) return null;
        // Sort the matches by prioritizing the route that has the least URI parameters
        else return matches.sort((a, b) => (a.getUriParams().length > b.getUriParams().length)).first();
    },

    /**
     * The flat list of all the routes.
     */
    _routes: []
};

Routes._routes.getViews = function () { return this.filter(r => (r.method == 'GET' && r.view)); }