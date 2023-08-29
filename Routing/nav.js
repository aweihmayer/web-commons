/**
 * Defines URL bar actions that will affect the current route.
 */
const Nav = {
    /**
     * Changes the url in the address bar,
     * adds an entry to the navigation history
     * and rerenders the app.
     */
    link: async function (path) {
        path = nav.getPath(path);
        if (nav.isPathCurrentLocation(path)) { return; }

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
        path = nav.getPath(path);
        if (nav.isPathCurrentLocation(path)) { return; }

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
        path = nav.getPath(path);
        if (nav.isPathCurrentLocation(path)) { return; }

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
};