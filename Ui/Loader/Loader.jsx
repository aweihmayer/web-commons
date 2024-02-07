class Loader extends React.Component {
    static defaultProps = {
        color: '#014c86'
    };

    render() {
        let animateTransform = '<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" />';
        return <div className="loader">
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                <circle cx="50" cy="50" fill="none" stroke={this.props.color} strokeWidth="5" r="44" strokeDasharray="200" dangerouslySetInnerHTML={{ __html: animateTransform }}>
                </circle>
            </svg>
        </div>;
    }

    static start(component) {
        if (component) {
            component.getAllRefs().forEach(c => {
                if (typeof c.startLoading === 'function') c.startLoading();
            });
        }

        // Show cursor loading animation if there are active loaders
        if (Loader.documentHasLoaders()) document.body.style.cursor = 'progress';
    }

    static stop(component) {
        if (component) {
            component.getAllRefs().forEach(c => {
                if (typeof c.stopLoading === 'function') c.stopLoading();
            });
        }

        // Remove cursor progress animation if there are no more active loaders
        if (!Loader.documentHasLoaders()) document.body.style.cursor = 'auto';
    }

    static documentHasLoaders() {
        return document.querySelectorAll('.loader').length > 0;
    }
};