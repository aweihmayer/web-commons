class Checkbox extends React.Component {
    render() {
        return <div className="input-wrapper">
            <input type="checkbox" ref="checkbox"
                value={this.props.value}
                name={this.props.name}
                id={this.props.id}
                defaultChecked={this.props.isChecked}
                onClick={this.props.onClick} />
            {this.props.i18n ? <label>{this.props.value.t()}</label> : null}
        </div>;
    }
}