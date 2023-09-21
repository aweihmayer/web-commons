class Link extends React.Component {
    render() {
        let href = null;
        if (typeof this.props.href !== 'undefined') {
            href = this.props.href
        } else if (typeof this.props.route !== 'undefined') {
            href = this.props.route.uri.relative(this.props.params);
        }

        return <a
            onClick={Router.goTo}
            className={document.buildClassName(this.props.className)}
            href={href}>
            {this.props.children}
        </a>;
    }
}