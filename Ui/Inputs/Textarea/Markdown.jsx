class MarkdownTextareaInput extends TextareaInput {
    constructor(props) {
        super(props);
        this.inputClassName = 'textarea-input markdown-input';
    }

    componentDidMount() {
        this.refs.input.editor = new Editor({ element: this.refs.input });
        let $this = this;
        this.refs.input.editor.codemirror.options.onKeyEvent = function () {
            $this.clearError.bind($this)
        };
        this.refs.input.editor.codemirror.setValue(this.refs.input.value);
        this.refs.input.editor.render();
    }

    fill(v) {
        v = v || '';
        this.refs.input.editor.codemirror.setValue(v);
    }

    raw() {
        return this.refs.input.editor.codemirror.getValue();
    }
}