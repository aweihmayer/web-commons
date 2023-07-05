class ToastContainer extends React.Component {
    constructor(props) {
        super(props);
        ToastContainer.instance = this;
        this.state = { toasts: [] };
    }

    static instance = null;

    render() {
        let toasts = [];
        for (let t of this.state.toasts) {
            toasts.push(<Toast
                key={t.id}
                type={t.type}
                id={t.id}
                title={t.title}
                message={t.message}
                actionLabel={t.actionLabel}
                action={t.action} />);
        }

        return <aside id="toast-container" ref="container"><ul>{toasts}</ul></aside>;
    }
}