class CheckboxGroupInput extends InputContainer {
    constructor(props) {
        super(props);
        this.inputClassName = 'checkbox-input checkbox-group-input';
    }

    render() {
        var $this = this;
        var input = [];
        this.state.schema.options.forEach(function(item, i) {
            input.push(<CheckboxCustomContainer key={i} id={$this.inputId + '-' + item} name={$this.name} value={item} onClick={$this.props.onClick} />);
        });

        return super.render(input);
    }

    fill(v) {
        var siblings = this.refs.container.querySelectorAll('[name="' + this.props.name + '"]');
        for (var i = 0; i < siblings.length; i++) {
            for (var y = 0; y < v.length; y++) {
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
        var siblings = this.refs.container.querySelectorAll('[name="' + this.props.name + '"]');
        for (var i = 0; i < siblings.length; i++) {
            siblings[i].checked = false;
        }
    }
}