function renderInput(schema, ref, tabIndex) {
    let input = schema.input ?? schema.type;
    ref = ref ?? schema.name;

    switch (input) {
        case 'text':
        case 'string':
            return <TextInput schema={config.otherNames} tabIndex={tabIndex} ref={ref} />;
        case 'email':
            return <EmailInput schema={schema} tabIndex={tabIndex} ref={ref} />;
        case 'password':
            return <PasswordInput schema={schema} tabIndex={tabIndex} ref={ref} />;
        case 'search':
            return <SearchInput schema={schema} tabIndex={tabIndex} ref={ref} />;
        case 'textarea':
            return <TextareaInput schema={schema} tabIndex={tabIndex} ref={ref} />;
        case 'select':
            return <SelectInput schema={schema} tabIndex={tabIndex} ref={ref} />;
        case 'radio':
            return <RadioInput schema={schema} tabIndex={tabIndex} ref={ref} />;
        case 'image':
            return <ImageInput schema={schema} tabIndex={tabIndex} ref={ref} />;
        case 'hidden':
            return <HiddenInput schema={config.id} ref={ref} />;
        case 'checkbox':
        case 'checkbox-single':
        case 'boolean':
        case 'bool':
            return <CheckboxInput schema={schema} tabIndex={tabIndex} ref={ref} />;
        case 'checkbox-group':
            return <CheckboxGroupInput schema={schema} tabIndex={tabIndex} ref={ref} />;
    }
}