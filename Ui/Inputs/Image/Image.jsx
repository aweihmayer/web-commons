﻿class ImageInput extends BaseInput {
    static defaultProps = {
        imageRoute: null
    };

    static cameraIcon = "url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20230.629%20230.629%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M230.629%2059.325H0v150.989h230.629V59.325zM115.314%20183.373c-26.814%200-48.553-21.738-48.553-48.554s21.738-48.553%2048.553-48.553%2048.555%2021.739%2048.555%2048.553-21.74%2048.554-48.555%2048.554zM88.041%2020.315h54.547l17.943%2028.93H70.1l17.941-28.93zm56.406%20114.504c0%2016.089-13.043%2029.133-29.133%2029.133s-29.131-13.044-29.131-29.133%2013.043-29.132%2029.131-29.132%2029.133%2013.043%2029.133%2029.132z%22%20fill%3D%22gray%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2Fsvg%3E)";

    render() {
        return <InputContainer label={this.schema.label} id={this.id} className={[this.props.className, 'image-input']} tooltip={this.props.tooltip} ref="container">
            <div className="input-wrapper" ref="input">
                <input type="file" name={this.schema.name} onChange={ev => this.change()} id={this.id} accept="image/png, image/jpeg" ref="file" />
                <input type="hidden" name="old" value="" ref="old" />
                <button type="button" onClick={ev => this.clear()}>x</button>
                <div style={{ backgroundImage: ImageInput.cameraIcon }} ref="preview"></div>
            </div>
        </InputContainer>;
    }

    clear() {
        this.refs.preview.style.backgroundImage = ImageInput.cameraIcon;
        this.refs.old.value = null;
        this.refs.file.value = '';
    }

    async change(ev) {
        this.refs.preview.style.backgroundImage = 'url(' + await this.readFile(this.refs.file.files[0]) + ')';
        this.refs.old.value = null;
    }

    fill(v) {
        if (!v) return;
        this.refs.preview.style.backgroundImage = 'url(' + this.props.imageRoute.getRelativeUri(v) + ')';
        this.refs.old.value = v;
    }

    async collect() {
        return await this.collectRaw();
    }

    async collectRaw() {
        if (this.refs.old.value) return this.refs.old.value;
        for (let file of this.refs.file.files) return await this.readFile(file);
        return null;
    }

    async readFile(file) {
        return new Promise(function (resolve, reject) {
            let reader = new FileReader();

            reader.onload = function (res) {
                resolve(res.target.result);
            };

            reader.readAsDataURL(file);
        });
    }
}