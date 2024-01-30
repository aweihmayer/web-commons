class Link extends React.Component {
    static defaultProps = {
        className: null,
        disabled: false,
        params: null
    };

    render() {
        let href = null;
        if (typeof this.props.href !== 'undefined') {
            href = this.props.href
        } else if (typeof this.props.route !== 'undefined') {
            href = this.props.route.getRelativeUri(this.props.params);
        }

        return <a
            onClick={ev => this.onClick(ev)}
            className={toClassName(this.props.className)}
            href={href}>
            {this.props.children}
        </a>;
    }

    onClick(ev) {
        if (this.props.disabled) ev.preventDefault();
        else Router.goTo(ev);
    }
}