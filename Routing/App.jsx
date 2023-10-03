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

        document.head.metadata.reset();
        Router.detect();
        await BundleManager.loadRouteBundles(Router.current.route);

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
        document.setCode(this.state.code);

        if (!document.hasErrorCode()) {
            return Router.current.route.view();
        }

        if (Routes.error[this.state.code]) { return Routes.error[this.state.code].view(); }
        else if (Routes.error.default) { return Routes.error.default.view(); }
        else { throw new Error('Error view not found. Implement Route.error.default or Route.error.CODE'); }
    }

    componentDidMount() {
        document.head.metadata.apply();
    }

    componentWillUpdate() {
        document.head.metadata.reset();
    }

    componentDidUpdate() {
        document.head.metadata.apply();
    }
}