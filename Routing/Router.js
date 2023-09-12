/**
 * Determines the current location's route.
 */
const Router = {
    current: { route: null, params: {} },

    /**
     * Callback function whenever route changes.
     * By default, this does nothing, override to implement custom features.
     * Useful for things like detecting locale in a URI.
     */
    onRouteChange: () => { },

    /** 
     * Detects the current location of the page and sets the current route.
     * @returns {Route} The current location's route or the error route if none was found.
     */
    detect: () => {
        let uri = new Uri(window.location.pathname);
        Router.current.params = {};
        for (let route of Routes._routes) {
            if (route.method == 'GET' && route.view && route.uri.compare(uri)) {
                Router.current.route = route;
            }
        }

        // No route was found. Set the current route as an error
        if (Router.current.route == null) {
            if (Routes.error.hasOwnProperties('404')) {
                Router.current.route = Routes.error['404'];
            } else {
                Router.current.route = new Route(() => <p>Implement the route "error.404" for a custom page for missing resources.</p>);
            }
            
            return Router.current.route;
        }

        // A route was found, get the parameters
        Router.current.params = Router.current.route.getParams();
        Router.onRouteChange();
        return Router.current.route;
    }
}