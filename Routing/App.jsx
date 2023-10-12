/**
 * Renders the correct view based on the current route.
 * Extend this component to create a custom layout.
 */
class App extends React.Component {
    constructor(props) {
        super(props);
        App.instance = this;
        this.state = {
            code: parseInt(!document.body.dataset.code ? 200 : document.body.dataset.code),
            route: null,
            params: {},
            locale: 'en'
        };
    }

    static root = null;
    static instance = null;
    static get state() { return App.instance.state; }

    static async mount(rootElement) {
        window.addEventListener('popstate', ev => {
            Router.reload(window.location.pathname + window.location.search, true);
        });
        App.root = ReactDOM.createRoot(rootElement);
        App.root.render(<App />);
    }

    static unmount() {
        App.root.unmount();
    }

    setRouting(routing) {
        this.setState({
            code: routing.code || 200,
            route: routing.route,
            params: routing.params,
            locale: routing.locale
        });
    }

    static setRouting(routing) {
        App.instance.setRouting(routing);
    }

    render() {
        if (this.state.route === null) { return null; }
        return this.state.route.view();
    }

    componentDidMount() {
        Router.goTo(window.location.pathname + window.location.search, true);
    }

    componentWillUpdate() {
        document.head.metadata.reset();
    }

    componentDidUpdate() {
        document.setCode(this.state.code);
        document.head.metadata.apply();
    }
}