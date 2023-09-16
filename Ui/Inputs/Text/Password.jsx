class PasswordInput extends TextInput {
    constructor(props) {
        props.autocomplete = 'off';
        props.className = 'password-input';
        props.textInputType = 'password';
        super(props);
    }
}