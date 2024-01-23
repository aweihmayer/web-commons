class RadioInput extends BaseInput {
    render() {
        return null;
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

    collectRaw() {
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