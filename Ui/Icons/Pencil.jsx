class PencilIcon extends React.Component {
    static defaultProps = {
        tooltip: 'Edit',
        color: '#000',
    }

    render() {
        return <IconContainer className={this.props.className} tooltip={this.props.tooltip}>
            <svg viewBox="0 0 13.229 13.229" fill={this.props.color}>
                <path d="M0 10.504l8.058-8.058 2.771 2.771-8.011 8.011H-.046zm8.981-8.773l1.72-1.72 2.563 2.563-1.732 1.732z" />
            </svg>
        </IconContainer>;
    }
}