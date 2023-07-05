class EmailInput extends TextInput {
    constructor(props) {
        super(props);
        this.textType = 'email';
        this.inputClassName = 'text-input email-input';
    }
}