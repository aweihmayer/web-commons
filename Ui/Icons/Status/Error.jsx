class ErrorIcon extends React.Component {
    static defaultProps = {
        tooltip: 'Error',
        color: '#fff',
    }

    render() {
        return <IconContainer className={this.props.className} tooltip={this.props.tooltip}>
            <svg viewBox="0 0 50 50" stroke="#000" strokeLinecap="round" strokeLinejoin="round" fill={this.props.color} fillRule="evenodd">
                <path d="M44.3731 7.6031c-10.137-10.137-26.632-10.138-36.7699 0s-10.1371 26.6321 0 36.7701 26.6319 10.138 36.7699 0 10.1369-26.633 0-36.7701zm-8.1319 28.638a2 2 0 0 1-2.8281 0l-7.425-7.425-7.778 7.7781c-.781.7809-2.047.7809-2.828 0a2 2 0 0 1 0-2.828l7.7781-7.7781-7.4251-7.4249c-.781-.7811-.781-2.0481 0-2.828s2.047-.7811 2.828 0l7.425 7.4249 7.071-7.0709a2 2 0 0 1 2.8281 2.828l-7.071 7.0709 7.425 7.425a2 2 0 0 1 0 2.828z" stroke="none" fillRule="nonzero" />
            </svg>
        </IconContainer>;
    }
}