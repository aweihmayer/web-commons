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
            if (!(route instanceof Route)) route = new Route(route);
            this.setProp(route.name, route);
            this._routes.push(route);
        }

        // Set group functions
        this._routes.forEach(route => {
            route.clearCaches = function () {
                let routes = this.toArray();
                Object.keys(this).forEach(k => {
                    if (this[k] instanceof Route) this[k].clearCaches();
                    Promise.all(routes.map(r => r.cache.clear()))
                })
            }
        });
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
        else return matches.sort((a, b) => {
            const uriParams1 = a.params.filter(p => p.location === 'uri').length;
            const uriParams2 = b.params.filter(p => p.location === 'uri').length;
            return uriParams1 > uriParams2;
        }).first();
    },

    /**
     * The flat list of all the routes.
     */
    _routes: []
};

Routes._routes.getViews = function () { return this.filter(r => (r.method == 'GET' && r.view)); }