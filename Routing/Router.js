/**
 * Handles navigation.
 */
const Router = {
    current: { route: null, params: {}, locale: 'en' },

    /**
     * Callback function whenever route changes.
     * Useful for things like detecting locale in a URI.
     */
    onRouteChange: () => { },

    /**
     * Callback function whenever the router or a fetch response encounters a 401 unauthorized response.
     */
    onUnauthorizedResponse: response => response,

    /**
     * Callback function whenever the router or a fetch response encounters a 401 unauthorized response. TODO
     */
    onUnauthorizedFetchResponse: response => response,

    /** 
     * Detects the current location of the page and sets the current route.
     * @returns {Route} The current location's route or the error route if none was found.
     */
    detect: () => {
        let uri = new Uri(window.location.pathname);
        Router.current.params = {};

        // We gather all the valid routes and pick the one that has the least amount of route params
        let validRoutes = Routes._routes.filter(r => (r.method == 'GET' && r.view && r.uri.compare(uri)));
        validRoutes.sort((a, b) => (a.uri.routeParamsCount > b.uri.routeParamsCount));
        if (validRoutes.length > 0) { Router.current.route = validRoutes[0]; }

        // No route was found. Set the current route as an error
        if (Router.current.route == null) {
            if (Routes.error.hasOwnProperties('404')) {
                Router.current.route = Routes.error['404'];
            } else {
                Router.current.route = new Route(() => <p>Implement the route "error.404" for a custom page for missing resources.</p>);
            }

            Router.onRouteChange();
            return Router.current.route;
        }

        // A route was found, get the parameters
        Router.current.params = Router.current.route.getParams();
        Router.onRouteChange();
        return Router.current.route;
    },

    /**
     * Changes the url in the address bar,
     * adds an entry to the navigation history
     * and rerenders the app.
     */
    goTo: async (path) => {
        path = Router.getPath(path);
        if (Router.isPathCurrentLocation(path)) { return; }

        window.history.pushState('', '', path);
        Router.detect();
        await BundleManager.loadRouteBundles(Router.current.route);
        App.refresh();
        window.scrollTo(0, 0);
    },

    /**
     * Changes the url in the address bar
     * and rerenders the app.
     */
    reload: async function (path) {
        path = Router.getPath(path);
        if (Router.isPathCurrentLocation(path)) { return; }

        window.history.replaceState('', '', path);
        Router.detect();
        await BundleManager.loadRouteBundles(Router.current.route);
        App.refresh();
        window.scrollTo(0, 0);
    },

    /**
     * Changes the url in the address bar.
     */
    replace: function (path) {
        path = Router.getPath(path);
        if (Router.isPathCurrentLocation(path)) { return; }

        window.history.replaceState('', '', url);
        Router.detect();
    },

    /**
     * Gets the path to use for navigation depending on the type of the value.
     * @param {any} value
     * @returns {string}
     */
    getPath: function (value) {
        // Value is a string, it is already the path
        if (typeof value == 'string') { return value; }
        // Value is a route
        else if (value instanceof Route) { return value.uri.relative(); }
        // Value is an event, we stop its normal behavior and get its href
        else if (value.target) {
            let el = value.target.closest('a[href]');
            if (el.hasAttribute('target')) { return null; }
            value.preventDefault();
            value.stopPropagation();
            return el.getAttribute('href');
        }

        throw new Error('Unable to get path for navigation');
    },

    /**
     * Determines if the path is the current location
     * @param {any} path
     * @returns {boolean}
     */
    isPathCurrentLocation: (path) => (path === (location.pathname + location.search))
}