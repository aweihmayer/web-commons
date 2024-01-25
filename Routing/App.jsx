/**
 * Renders the correct view based on the current route.
 * Extend this component to create a custom layout.
 */
class App extends React.Component {
    constructor(props) {
        super(props);
        App.instance = this;
        this.state = Router.detect();
        this.state.code = document.getCode();
    }

    static root = null;
    static instance = null;
    static get state() { return App.instance.state; } // TODO why 2 render at start

    static async mount(rootElement) {
        window.addEventListener('popstate', ev => { Router.reload(window.location.pathname + window.location.search, true); });
        App.root = ReactDOM.createRoot(rootElement);
        App.root.render(<App />);
    }

    static unmount() {
        App.root.unmount();
    }

    setRouting(routing) {
        this.setState(routing);
    }

    static setRouting(routing) {
        App.instance.setRouting(routing);
    }

    static setCode(code) {
        if (typeof code === 'object') code = code.status || code.message;
        App.setRouting({ code: parseInt(code) });
    }

    render() {
        let route = this.state.route;
        let code = this.state.code;

        if (code >= 300 || code < 200 && Routes.error) {
            if (Routes.error.hasOwnProperty(code)) route = Routes.error[code];
            else if (Routes.error.default) route = Routes.error.default;
            else route = new Route(() => <p>Implement the route "error.{code}" or "error.default" for a custom error page.</p>);
        }

        if (route === null) {
            if (Routes.error && Routes.error.hasOwnProperty(404)) route = Routes.error[404];
            else route = new Route(() => <p>Implement the route "error.404" for a custom error page.</p>);
        }

        return route.view(this.state.params);
    }

    componentWillUpdate() {
        document.head.metadata.reset();
    }

    componentDidUpdate() {
        document.setCode(this.state.code);
        document.head.metadata.apply();
    }
}