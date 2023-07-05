class WarningIcon extends StatusIcon {
    render() {
        return super.render(<svg viewBox="0 0 55 55" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill={this.props.color} fill-rule="evenodd">
            <path d="M25.9999 0C11.6639 0 0 11.663 0 26s11.6639 26 25.9999 26 26-11.663 26-26-11.6638-26-26-26zm2 41c0 1.104-.896 2-2 2s-2-.896-2-2v-2c0-1.104.896-2 2-2s2 .896 2 2v2zm0-8c0 1.104-.896 2-2 2s-2-.896-2-2V11c0-1.104.896-2 2-2s2 .896 2 2v22z" stroke="none" fill-rule="nonzero" />
        </svg>);
    }
}