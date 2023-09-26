class CheckboxGroupInput extends BaseInput {
    constructor(props) {
        super(props);
        this.inputClassName = 'checkbox-input checkbox-group-input';
    }

    render() {
        let $this = this;
        let input = [];
        this.state.schema.options.forEach(function(item, i) {
            input.push(<CheckboxCustomContainer key={i} id={$this.inputId + '-' + item} name={$this.name} value={item} onClick={$this.props.onClick} />);
        });

        let className = document.buildClassName('text-input', this.props.className);
        return <InputContainer className={className} id={this.containerId} inputId={this.inputId} ref="container">
            {input}
        </InputContainer>;
    }

    fill(v) {
        let siblings = this.refs.container.querySelectorAll('[name="' + this.props.name + '"]');
        for (let i = 0; i < siblings.length; i++) {
            for (let y = 0; y < v.length; y++) {
                if (v[y] == siblings[i].value) {
                    siblings[i].checked = true;
                    break;
                } else {
                    siblings[i].checked = false;
                }
            }
        }
    }

    raw() {
        return this.refs.container.querySelectorAll('input:checked').map(inp => inp.value);
    }

    clear() {
        let siblings = this.refs.container.querySelectorAll('[name="' + this.props.name + '"]');
        for (let i = 0; i < siblings.length; i++) {
            siblings[i].checked = false;
        }
    }
}