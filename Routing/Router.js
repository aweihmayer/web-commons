/**
 * Handles navigation.
 */
const Router = {
    /**
     * Called before the any route changes.
     * @param {{ route: Route, params: object, locale: string }} newRouting
     * @returns {boolean}
     */
    beforeRouteChange: newRouting => { },

    afterRouteChange: () => { },

    detect: (href) => {
        href = href || (window.location.pathname + window.location.search);
        let uri = new Uri(href);
        let routing = {
            code: 200,
            route: Routes.matchViewRoute(uri),
            params: {},
            locale: 'en'
        };

        if (routing.route !== null) {
            routing.params = routing.route.getParams(href);
        } else {
            routing.code = 404;
            routing.route = null;
        }

        routing.params = routing.route.getParams(href);
        return routing;
    },

    changeRoute: async function (path, action, force) {
        // Determine by parsing the path value
        let href = null;
        if (typeof path == 'string') {
            href = path;
        } else if (path instanceof Route) {
            href = path.uri.relative();
        } else if (typeof path === 'object' && path.target) {
            let el = path.target.closest('a[href]');
            if (!el) return;
            href = el.getAttribute('href');
        } else {
            return;
        }

        // Same location, do nothing
        if (!force && href === (location.pathname + location.search)) return;

        let newRouting = this.detect(href);
        this.beforeRouteChange(newRouting);
        if (typeof newRouting.route.beforeRouteChange === 'function') newRouting.route.beforeRouteChange(newRouting);

        action(href);
        document.head.metadata.reset();
        await document.loadBundles(newRouting.route.bundles);
        App.setRouting(newRouting);
        this.afterRouteChange();
        window.scrollTo(0, 0);
    },

    /**
     * Changes the url in the address bar while adding an entry to the navigation history.
     */
    goTo: function (path, force) {
        if (typeof path === 'object') {
            if (path.preventDefault) path.preventDefault();
            if (path.stopPropagation) path.stopPropagation();
        }
        this.changeRoute(path, href => { window.history.pushState('', '', href); }, force);
    },

    /**
     * Changes the url in the address bar.
     */
    reload: async function (path, force) {
        if (typeof path === 'object') {
            if (path.preventDefault) path.preventDefault();
            if (path.stopPropagation) path.stopPropagation();
        }
        this.changeRoute(path, href => { window.history.replaceState('', '', href) }, force);
    },

    /**
     * Changes the url in the address bar.
     */
    replace: function (path) {
        if (typeof path === 'object') {
            if (path.preventDefault) path.preventDefault();
            if (path.stopPropagation) path.stopPropagation();
        }
        this.changeRoute(path, href => { window.history.replaceState('', '', href) });
    }
}