class SearchInput extends TextInput {
    constructor(props) {
        props.autocomplete = 'off';
        props.inputClassName = 'search-input';
        props.textInputType = 'search';
        super(props);
    }
}