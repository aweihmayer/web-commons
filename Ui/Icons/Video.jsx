class VideoIcon extends React.Component {
    constructor(props) {
        super(props);
        this.id = document.createUniqueId(String.random(10));
    }

    static defaultProps = {
        tooltip: 'Video',
        color: '#000000',
    }

    render() {
        return <IconContainer className={this.props.className} tooltip={this.props.tooltip}>
            <svg id={this.id} viewBox="0 0 512 512">
                <g>
                    <path fill={this.props.color} d="M256,0C114.625,0,0,114.625,0,256c0,141.374,114.625,256,256,256c141.374,0,256-114.626,256-256   C512,114.625,397.374,0,256,0z M351.062,258.898l-144,85.945c-1.031,0.626-2.344,0.657-3.406,0.031   c-1.031-0.594-1.687-1.702-1.687-2.937v-85.946v-85.946c0-1.218,0.656-2.343,1.687-2.938c1.062-0.609,2.375-0.578,3.406,0.031   l144,85.962c1.031,0.586,1.641,1.718,1.641,2.89C352.703,257.187,352.094,258.297,351.062,258.898z" />
                </g>
            </svg>
        </IconContainer>;
    }
}