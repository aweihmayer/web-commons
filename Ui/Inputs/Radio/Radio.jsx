class RadioInput extends BaseInput {
    constructor(props) {
        props.className = 'radio-input';
        super(props);
    }

    render() {
        let className = document.buildClassName('text-input', this.props.className);
        return null; // TODO
        /*return <InputContainer className={className} id={this.containerId} inputId={this.inputId} ref="container">this.props.options.map((v, k) => (
            <label key={k} htmlFor={'input-' + this.props.name + '-' + v}>
                <input type="radio" value={v} name={this.props.name} id={this.inputId + '-' + v} onChange={this.clearError.bind(this)} />
                <span className="txt">{(this.props.name + "-" + v).t()}</span>
                <span className="cb"></span>
                <span className="bg"></span>
            </label>))
        </InputContainer>;*/
    }

    fill(v) {
        let siblings = this.refs.container.querySelectorAll('[name="' + this.props.name + '"]');
        for (let i = 0; i < siblings.length; i++) {
            if (siblings[i].value == v) {
                siblings[i].checked = true;
                return;
            }
        }
    }

    raw() {
        let input = this.refs.container.querySelector('input:checked');
        return input ? input.value : null;
    }

    clear() {
        let siblings = this.refs.container.querySelectorAll('[name="' + this.props.name + '"]');
        for (let i = 0; i < siblings.length; i++) {
            siblings[i].checked = false;
        }
    }
}