/** 
 *  The list of routes.
 */
const Routes = {
    /**
     * Adds routes.
     * @param {Array<Route|object>} routes Route instances or a plain JSON config object.
     */
    add: (routes) => {
        if (!Array.isArray(routes)) { routes = [routes]; }

        for (let r of routes) {
            let route = r;
            if (!(route instanceof Route)) {
                route = new Route(route.name, route.uri, route.method, route);
            }

            Routes.setProp(route.name, route);
            Routes._routes.push(route);
        }
    },

    /**
     * Finds a route by name.
     * @param {any} name
     * @returns {Route}
     */
    find: (name) => Routes._routes.find(r => r.name === name),

    /**
     * A flattened list of all the routes.
     */
    _routes: []
};