class IconContainer extends React.Component {
    render(svg) {
        return <span
            className={toClassName(this.props.className, 'icon')}
            title={this.props.tooltip}>
            {this.props.children}
        </span>;
    }
}