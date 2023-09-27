/**
 * Renders the correct view based on the current route.
 * Extend this component to create a custom layout.
 */
class App extends React.Component {
    constructor(props) {
        super(props);
        let code = !document.body.dataset.code ? 200 : document.body.dataset.code;
        this.state = { code: parseInt(code) };
        App.instance = this;
    }

    static root = null;
    static instance = null;

    /**
     * Mounts the app while loading necessary assets and adding listeners.
     * @param {Element} root The element that will contain the app.
     * @param {any} component The React component of the app.
     */
    static async mount(root, component) {
        // When the user navigates using the browser, we must detect the new route and rerender
        window.addEventListener('popstate', function (event) {
            Router.detect();
            App.refresh(200);
        });

        // Detect the route and load assets
        Router.detect();
        await BundleManager.loadRouteBundles(Router.current.route);

        // Render the app
        App.root = ReactDOM.createRoot(root);
        App.root.render(component);
    }

    /**
     * Unmounts the app.
     */
    static unmount() {
        App.root.unmount();
    }

    /**
     * Rerenders the app based on the current location.
     * @param {any} code The HTTP code.
     */
    static refresh(code) {
        if (typeof code == 'undefined') { App.instance.setState({}); }
        else { App.instance.setState({ code: code }); }
    }

    /**
     * Returns the current view route.
     * @returns {React.Component}
     */
    render() {
        // Set code on body
        document.body.dataset.code = this.state.code;
        document.body.setAttribute('data-code', this.state.code);

        let route;
        // If the DOM tells us there is an error, we pick the error route
        if (this.state.code > 199 && this.state.code < 300) {
            route = Router.current.route;
        } else {
            if (this.state.code == 401) { Router.onUnauthorizedResponse(); }
            if (Routes.error[this.state.code]) { route = Routes.error[this.state.code]; }
            else if (Routes.error.default) { route = Routes.error.default; }
            else { throw new Error('Error view not found. Implement Route.error.default or Route.error.CODE'); }
        }

        return route.view();
    }
}