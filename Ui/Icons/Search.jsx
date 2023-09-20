class SearchIcon extends Icon {
    render() {
        return super.render(<svg viewBox="0 0 25 25" width="25" height="25" stroke="#000" strokeLinecap="round" strokeLinejoin="round" fill={this.props.color} fillRule="evenodd">
            <path d="M24.6849 23.2181l-7.1729-7.1838c1.4141-1.6973 2.2646-3.8663 2.2646-6.2353C19.7766 4.3944 15.3448 0 9.8935 0S0 4.3995 0 9.8041s4.4318 9.799 9.8832 9.799c2.3158 0 4.4472-.7948 6.1379-2.1228l7.1985 7.2043c.4201.4205 1.0452.4205 1.4653 0s.4201-1.046 0-1.4665zM2.1006 9.8041c0-4.2457 3.4942-7.6966 7.7826-7.6966s7.7826 3.4509 7.7826 7.6966-3.4943 7.6967-7.7826 7.6967-7.7826-3.4561-7.7826-7.6967z" fillRule="nonzero" stroke="none" />
        </svg>);
    }
}