﻿class Picture extends React.Component {
    render() {
        let alt = this.props.alt ?? 'Image';
        let src = this.props.route.getRelativeUri(this.props.default);
        return <picture className={this.props.className}>
            <img src={src} alt={alt} />
        </picture>;
    }
}