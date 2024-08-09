class EmbeddedYouTubeVideo extends React.Component {
    static URL = 'https://www.youtube.com/embed/';

    render() {
        let query = { enablejsapi: 1 };
        if (this.props.autoplay) query.autoplay = 1;
        if (this.props.startAt) query.start = this.props.startAt;
        let src = EmbeddedYouTubeVideo.URL + this.props.id + Object.toQueryString(query);

        return <iframe width="560" height="315"
            title="YouTube video player"
            src={this.props.lazyload ? null : src}
            data-lazyload={src}
            frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            autoPlay={this.props.autoplay ? "1" : null}
            allowFullScreen
            ref="iframe">
        </iframe>;
    }

    pause() {
        EmbeddedYouTubeVideo.pause(this.refs.iframe);
    }

    static pause(el) {
        el.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }

    static pauseAll(el) {
        let iframes = el.querySelectorAll('iframe');
        Array.from(iframes).forEach(f => { EmbeddedYouTubeVideo.pause(f); });
    }
}