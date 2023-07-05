class PencilIcon extends Icon {
    constructor(props) {
        props.tooltip = props.tooltip || 'Edit';
        super(props);
    }

    render() {
        return super.render(<svg viewBox="0 0 13.229 13.229" fill="#fff">
            <path d="M0 10.504l8.058-8.058 2.771 2.771-8.011 8.011H-.046zm8.981-8.773l1.72-1.72 2.563 2.563-1.732 1.732z" />
        </svg>);
    }
}