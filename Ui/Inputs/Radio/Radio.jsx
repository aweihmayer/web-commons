class RadioInput extends InputContainer {
    static className = 'radio-input';

    constructor(props) {
        super(props);
        this.inputClassName = RadioInput.className;
    }

    render() {
        return super.render(this.props.options.map((v, k) => (
            <label key={k} htmlFor={'input-' + this.props.name + '-' + v}>
                <input type="radio" value={v} name={this.props.name} id={this.inputId + '-' + v} onChange={this.clearError.bind(this)} />
                <span className="txt">{(this.props.name + "-" + v).i18n()}</span>
                <span className="cb"></span>
                <span className="bg"></span>
            </label>)));
    }

    fill(v) {
        var siblings = this.refs.container.querySelectorAll('[name="' + this.props.name + '"]');
        for (var i = 0; i < siblings.length; i++) {
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
        var siblings = this.refs.container.querySelectorAll('[name="' + this.props.name + '"]');
        for (var i = 0; i < siblings.length; i++) {
            siblings[i].checked = false;
        }
    }
}