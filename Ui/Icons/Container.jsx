class IconContainer extends React.Component {
    render(svg) {
        return <span
            className={document.buildClassName(this.props.className, 'icon')}
            title={this.props.tooltip}>
            {this.props.children}
        </span>;
    }
}