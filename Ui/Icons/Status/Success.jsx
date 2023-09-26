class SuccessIcon extends React.Component {
    static defaultProps = {
        tooltip: 'Success',
        color: '#fff',
    }

    render() {
        return <IconContainer className={this.props.className} tooltip={this.props.tooltip}>
            <svg viewBox="0 0 50 50" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill={this.props.color} fill-rule="evenodd">
                <path d="M23.9999 0C10.7 0 0 10.7 0 24s10.7 24 23.9999 24 24-10.6999 24-24-10.7-24-24-24zM37.4 18L22.1 33.5c-.6.6-1.6.6-2.2 0L11.5 25c-.6-.6-.6-1.6 0-2.2l2.2-2.2c.5999-.6 1.5999-.6 2.2 0l4.3999 4.5c.4001.4 1.1001.4 1.5 0l11.2-11.6c.6001-.6 1.6001-.6 2.2002 0L37.4 15.7c.7.6.7 1.6 0 2.3z" stroke="none" fill-rule="nonzero" />
            </svg>
        </IconContainer>;
    }
}