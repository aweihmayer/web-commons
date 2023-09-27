/**
 * @param {object} props
 * @param {string|string[]} [props.className]
 * @param {string} [props.label]
 * @param {React.Component} [props.icon]
 * @param {'button'|'submit'} [props.type]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.loadable] Determines if the button can show a loading spinner.
 * @param {any} [props.value]
 */
class Button extends React.Component {
    static defaultProps = {
        icon: null,
        type: 'button',
        disabled: false,
        loadable: false,
    };

    render() {
        return <button ref="button"
            className={document.buildClassName(this.props.className, 'btn')}
            type={this.props.type}
            onClick={this.handleClick.bind(this)}
            disabled={this.props.disabled}
            data-value={this.props.value}>
            {this.props.icon}
            {this.props.label ? <span>{this.props.label}</span> : null}
            {this.props.loadable ? <Loader></Loader> : null}
        </button>;
    }

    /**
     * Handles the on click event.
     * @param {Event} ev
     */
    async handleClick(ev) {
        // Do nothing if there is no event attached
        if (!this.props.onClick) { return; }
        // Disable the button to prevent multiple unwanted triggers by double clicking
        this.disable();
        // Execute the on click event
        await this.props.onClick(ev);
        // Renable the button
        this.enable();
    }

    /**
     * Disables the button.
     * @param {boolean} [toggle] True to disable, false to enable. True by default.
     */
    disable(toggle) {
        if (typeof toggle === 'undefined') { toggle = true; }
        this.refs.button.disabled = toggle;
    }

    /**
     * Enables the button.
     */
    enable() {
        this.refs.button.disabled = false;
    }
}