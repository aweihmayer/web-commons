﻿class RadioInput extends BaseInput {
    render() {
        return null;
    }

    setValue(v) {
        let siblings = this.refs.container.querySelectorAll('[name="' + this.props.name + '"]');
        for (let i = 0; i < siblings.length; i++) {
            if (siblings[i].value == v) {
                siblings[i].checked = true;
                return;
            }
        }
    }

    getRawValue() {
        let input = this.refs.container.querySelector('input:checked');
        return input ? input.value : null;
    }

    clearValue() {
        let siblings = this.refs.container.querySelectorAll('[name="' + this.props.name + '"]');
        for (let i = 0; i < siblings.length; i++) {
            siblings[i].checked = false;
        }
    }
}