class WarningIcon extends React.Component {
    static defaultProps = {
        tooltip: 'Warning',
        color: '#fff',
    }

    render() {
        return <IconContainer className={this.props.className} tooltip={this.props.tooltip}>
            <svg viewBox="0 0 55 55" stroke="#000" strokeLinecap="round" strokeLinejoin="round" fill={this.props.color} fillRule="evenodd">
                <path d="M25.9999 0C11.6639 0 0 11.663 0 26s11.6639 26 25.9999 26 26-11.663 26-26-11.6638-26-26-26zm2 41c0 1.104-.896 2-2 2s-2-.896-2-2v-2c0-1.104.896-2 2-2s2 .896 2 2v2zm0-8c0 1.104-.896 2-2 2s-2-.896-2-2V11c0-1.104.896-2 2-2s2 .896 2 2v22z" stroke="none" fillRule="nonzero" />
            </svg>
        </IconContainer>;
    }
}