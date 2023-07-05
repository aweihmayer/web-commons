class PasswordInput extends TextInput {
    constructor(props) {
        props.autocomplete = 'off';
        super(props);
        this.inputClassName = 'text-input password-input';
        this.textType = 'password';
    }
}