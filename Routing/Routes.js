/** 
 *  The list of routes.
 */
const Routes = {
    /**
     * Adds routes.
     * @param {Array<{path: string, route: Route}>} routes The key should be a JSON path and will become the name of the route. You can retrieve them with that path.
     */
    add: function (routes) {
        for (let name in routes) {
            routes[name].name = name;
            Routes.setProp(name, routes[name]);
            Routes._routes.push(routes[name]);
        }
    },

    /**
     * A flattened list of all the routes.
     */
    _routes: []
};