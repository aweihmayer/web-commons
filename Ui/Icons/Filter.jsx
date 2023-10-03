class FilterIcon extends React.Component {
    static defaultProps = {
        tooltip: 'Filter',
        color: '#000',
    }

    render() {
        return <IconContainer className={this.props.className} tooltip={this.props.tooltip}>
            <svg viewBox="0 0 16 16" fill={this.props.color}>
                <path fillRule="evenodd" clipRule="evenodd" d="M15 2v1.67l-5 4.759V14H6V8.429l-5-4.76V2h14zM7 8v5h2V8l5-4.76V3H2v.24L7 8z" />
            </svg>
        </IconContainer>;
    }
}