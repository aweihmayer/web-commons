class SearchInput extends TextInput {
    constructor(props) {
        props.autocomplete = 'off';
        super(props);
        this.inputClassName = 'text-input search-input';
        this.textType = 'search';
    }
}