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
        props.className = props.className || '';
        props.tooltip = props.tooltip || '';
        props.color = props.color || '#000';
        if (props.color.charAt(0) != '#') { props.color = '#' + props.color; }
        props.id = Math.floor(Math.random() * 100000);
        props.href = '#' + props.id;
        super(props);
    }

    render(svg) {
        return <span
            className={this.props.className.toClassName('icon')}
            title={this.props.tooltip}>
            {svg}
        </span>;
    }
}