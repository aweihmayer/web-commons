/**
 * Defines the HTML page metadata for search engines.
 */
class SearchEngineMetadata {
    constructor(defaults) {
        if (typeof defaults !== 'undefined') { this.defaults = defaults; }

        this.description = null;
        this.image = null;
        this.title = null;
        this.titlePrefix = null;
        this.titleSuffix = null;
        this.robots = SearchEngineMetadata.robots.follow;
        this.type = SearchEngineMetadata.type.website;
        this.modifiedTime = null;
        this.section = null;
        this.siteName = null;
        this.locale = 'en_US';
    }

    static type = {
        article: 'article',
        profile: 'profile',
        website: 'website'
    }

    static robots = {
        follow: 'index, follow',
        nofollow: 'noindex, nofollow'
    }

    /**
     * Resets the values to their defaults.
     */
    reset() {
        if (typeof this.defaults === 'undefined') return;
        Object.assign(this, this.defaults);
    }

    /**
     * Creates, updates or removes metadata nodes.
     */
    apply() {
        document.title = [this.titlePrefix, this.title, this.titleSuffix].filterEmpty().join(' ').trim();
        let route = App.state.route;

        let metadata = [
            { name: 'og:title',         attribute: 'property',  value: document.title },
            { name: 'robots',           attribute: 'name',      value: this.robots },
            { name: 'description',      attribute: 'name',      value: this.description },
            { name: 'og:description',   attribute: 'property',  value: this.description },
            { name: 'og:type',          attribute: 'property',  value: this.type },
            { name: 'og:section',       attribute: 'property',  value: this.section },
            { name: 'og:modified_time', attribute: 'property',  value: this.modifiedTime },
            { name: 'og:image',         attribute: 'property',  value: this.image },
            { name: 'og:url',           attribute: 'property',  value: (route ? route.uri.canonical(App.state.params) : null) }
        ];

        document.head.applyMetadata(metadata);
    }
}

if (typeof document.head === 'undefined') { document.head = {}; }
document.head.metadata = new SearchEngineMetadata(new SearchEngineMetadata());