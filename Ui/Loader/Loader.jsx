/**
 * Defines a spinning loader.
 * @param {object} props
 * @param {boolean} [props.active]
 * @param {string} [props.color] Hex color code
 */
class Loader extends React.Component {
    /**
     * The default color of the loader.
     */
    static color = '#014c86';

    render() {
        let color = this.props.color ? this.props.color : Loader.color;
        let animateTransform = '<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" />';
        return <div className={this.props.active ? 'loader active' : 'loader'}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                <circle cx="50" cy="50" fill="none" stroke={color} strokeWidth="5" r="44" strokeDasharray="200" dangerouslySetInnerHTML={{ __html: animateTransform }}>
                </circle>
            </svg>
        </div>;
    }

    /**
     * Activate loaders.
     * @param {Element} [container] The container of the loaders to activate. The default container is the entire document.
     */
    static start(container) {
        container = container || document;
        Loader.showOrHideLoaders(container, 'activate');

        // Show cursor loading animation if there are active loaders
        if (Loader.getActiveLoaders().length > 0) {
            document.body.style.cursor = 'progress';
        }
    }

    /**
     * Deactivates loaders.
     * @param {Element} [container] The container of the loaders to activate. The default container is the entire document.
     */
    static stop(container) {
        container = container || document;
        Loader.showOrHideLoaders(container, 'deactivate');

        // Remove cursor progress animation if there are no more active loaders
        if (Loader.getActiveLoaders().length == 0) {
            document.body.style.cursor = 'auto';
        }
    }

    /**
     * Base function for deactivating or activating loaders.
     * @param {Element} [container] The container of the loaders. The default container is the entire document.
     * @param {'activate'|'deactivate'} action
     */
    static showOrHideLoaders(container, action) {
        container = container || document;
        let loaders = container.querySelectorAll('.loader');

        // For each loader element
        for (let loader of loaders) {
            let parent = loader.parentNode;

            // Show or hide siblings of a loader
            for (let sibling of parent.children) {
                if (action == 'activate') { sibling.classList.add('hidden-while-loading'); }
                else { sibling.classList.remove('hidden-while-loading');}
            }

            // Handle buttons
            let buttonEl = loader.closest('button');
            if (buttonEl) {
                // Disable button if activating. Save the current of the button in an attribute
                if (action == 'activate') {
                    buttonEl.dataset.wasDisabled = buttonEl.hasAttribute('disabled') ? '1' : '0';
                    buttonEl.disabled = true;
                // Set the button to its previous state when deactivating
                } else {
                    buttonEl.disabled = (buttonEl.dataset.wasDisabled == '1');
                    delete buttonEl.dataset.wasDisabled;
                }
            }

            // Toggle the activation classes on the loader
            if (action == 'activate') {
                loader.classList.remove('hidden-while-loading');
                loader.classList.add('active');
            } else {
                loader.classList.remove('active');
            }
        }
    }

    /** 
     *  Gets all active loaders in the document.
     *  @returns {NodeListOf<Element>}
     */
    static getActiveLoaders() {
        return document.querySelectorAll('.loader.active');
    }
};