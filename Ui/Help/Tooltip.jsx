class Tooltip extends React.Component {
    render() {
        if (!this.props.tip) { return null; }
        return <span>?</span>
    }
}