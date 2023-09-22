/**
 * Defines an SVG icon.
 */
class Icon extends React.Component {
    /**
     * @param {object} props
     * @param {string|string[]} [props.className]
     * @param {string} [props.tooltip]
     * @param {string} [props.color]
     */
    constructor(props) {
        super(props);
        this.id = document.createUniqueId(String.random(10));
        this.href = '#' + this.id;
    }

    static defaultProps = {
        className: '',
        tooltip: '',
        color: '#000',
    }

    render(svg) {
        return <span
            className={document.buildClassName(this.props.className, 'icon')}
            title={this.props.tooltip}>
            {svg}
        </span>;
    }
}