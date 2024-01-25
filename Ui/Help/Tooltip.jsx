class Tooltip extends React.Component {
    render() {
        if (!this.props.tip) return null;
        else return <span className="tooltip" data-tip={this.props.tip}>?</span>
    }
}