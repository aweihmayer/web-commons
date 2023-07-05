class View extends React.Component {
    load() { }

    componentDidMount() {
        if (this.meta) { this.meta.apply(); }
        this.load();
    }

    componentDidUpdate() {
        if (this.meta) { this.meta.apply(); }
        this.load();
    }
}