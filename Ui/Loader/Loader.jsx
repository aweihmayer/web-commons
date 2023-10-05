﻿/**
 * Defines a spinning loader.
 * @param {object} props
 * @param {boolean} [props.active]
 * @param {string} [props.color] Hex color code
 */
class Loader extends React.Component {
    static defaultProps = {
        color = '#014c86'
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
        if (typeof component.startLoading === 'function') { 
            component.startLoading();
        }

        for (let r in component.refs) {
            Loader.start(component.refs[r]);
        }

        // Show cursor loading animation if there are active loaders
        if (Loader.documentHasLoaders()) {
            document.body.style.cursor = 'progress';
        }
    }

    static stop(component) {
        if (typeof component.stopLoading === 'function') {
            component.stopLoading();
        }

        for (let r in component.refs) {
            Loader.stop(component.refs[r]);
        }

        // Remove cursor progress animation if there are no more active loaders
        if (!Loader.documentHasLoaders()) {
            document.body.style.cursor = 'auto';
        }
    }

    static documentHasLoaders() {
        return document.querySelectorAll('.loader').length > 0;
    }
};