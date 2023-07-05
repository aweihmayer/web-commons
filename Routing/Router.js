/**
 * Determines the current location's route.
 */
const Router = {
    current: { route: null, params: {} },

    /**
     * Callback function whenever route changes.
     * By default, this does nothing, override to implement custom features.
     * Useful for things like detecting locale in a url.
     */
    onRouteChange: function () { },

    /** 
     * Detects the current location of the page and sets it as the current route.
     * @returns {Route} The current location's route or the error route if none was found.
     */
    detect: function () {
        let relativeUrl = window.location.pathname;
        Router.current.params = {};
        Router.current.route = Router.match(relativeUrl);

        // No route was found. Set the current route as an error
        if (Router.current.route == null) {
            Router.current.route = Routes.error['404'];
            return Router.current.route;
        }

        Router.current.params = Router.current.route.getParams();
        Router.onRouteChange();
        return Router.current.route;
    },

    /**
     * Finds the route matching with a path. This only finds routes with a view.
     * @param {string} relativeUrl
     * @returns {Route|null}
     */
    match: function(relativeUrl) {
        relativeUrl = relativeUrl.removeQueryString();
        let parts = relativeUrl.getUrlParts();

        // Compare all routes that have a view
        for (let route of Routes._routes) {
            if (route.method != 'GET' || !route.view || !route.compare(parts)) { continue; }
            return route;
        }

        return null;
    }
}