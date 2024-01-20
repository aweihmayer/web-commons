class Button extends React.Component {
    static defaultProps = {
        className: null,
        disabled: false,
        icon: null,
        isLoading: false,
        label: null,
        loadable: false,
        onClick: null,
        type: 'button',
        value: null
    };

    constructor(props) {
        super(props);
        this.state = {
            disabled: props.disabled,
            isLoading: props.isLoading
        };
    }

    render() {
        return <button ref="button"
            className={toClassName(this.props.className, 'btn')}
            disabled={this.state.disabled}
            type={this.props.type}
            onClick={ev => { this.handleClick(ev) }}
            data-value={this.props.value}>
            {this.state.isLoading ? <Loader /> : this.props.children}
        </button>;
    }

    async handleClick(ev) {
        if (!this.props.onClick) return;
        this.disable();
        await this.props.onClick(ev);
        this.enable();
    }

    disable(toggle) {
        if (typeof toggle === 'undefined') toggle = true;
        this.setState({ disabled: toggle });
    }

    enable() {
        this.setState({ disabled: false });
    }

    startLoading() {
        this.setState({ isLoading: true });
    }

    stopLoading() {
        this.setState({ isLoading: false });
    }
}