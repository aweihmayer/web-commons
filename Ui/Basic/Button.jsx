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
            className={document.buildClassName(this.props.className, 'btn')}
            disabled={this.state.disabled}
            type={this.props.type}
            onClick={(ev) => { this.handleClick(ev); }}
            data-value={this.props.value}>
            {this.state.isLoading ? <Loader></Loader> : this.props.children}
        </button>;
    }

    async handleClick(ev) {
        if (!this.props.onClick) { return; }
        this.disable();
        await this.props.onClick(ev);
        this.enable();
    }

    disable(toggle) {
        if (typeof toggle === 'undefined') { toggle = true; }
        this.refs.button.disabled = toggle;
        this.setState({ disabled: toggle });
    }

    enable() {
        this.refs.button.disabled = false;
        this.refs.button.removeAttribute('disabled');
        this.setState({ disabled: false });
    }
}