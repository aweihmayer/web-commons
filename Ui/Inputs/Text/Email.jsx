class EmailInput extends TextInput {
    constructor(props) {
        props.className = 'email-input';
        props.textInputType = 'email';
        super(props);
    }
}