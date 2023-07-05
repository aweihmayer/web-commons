class InfoIcon extends StatusIcon {
    render() {
        return super.render(<svg viewBox="0 0 500 500" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill={this.props.color} fill-rule="evenodd">
            <path d="M229.9999 0C102.975 0 0 102.975 0 230s102.975 230 229.9999 230 230-102.974 230-230-102.9749-230-230-230zm38.333 377.36c0 8.676-7.0339 15.7101-15.71 15.7101h-43.1008c-8.676 0-15.7102-7.0341-15.7102-15.7101V202.477c0-8.676 7.0332-15.71 15.7102-15.71h43.1008c8.6761 0 15.71 7.033 15.71 15.71V377.36zM229.9999 157c-21.5388 0-39-17.461-39-39s17.4612-39 39-39 39 17.461 39 39-17.461 39-39 39z" stroke="none" fill-rule="nonzero" />
        </svg>);
    }
}