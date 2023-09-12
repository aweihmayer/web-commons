/**
 * Defines the HTML page metadata for search engines.
 */
class SearchEngineMetadata {
    constructor(siteName, locale, title, titlePrefix, titleSuffix, description, image) {
        this.defaults = {
            title: null,
            titlePrefix: null,
            titleSuffix: null,
            robots: SearchEngineMetadata.robots.follow,
            type: SearchEngineMetadata.type.website,
            modifiedTime: null,
            section: null,
            description: null,
            image: null
        };

        this.siteName = siteName;
        this.locale = locale;
        this.titlePrefix = titlePrefix;
        this.titleSuffix = titleSuffix;
        this.description = description;
        this.Image = image;
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
     * Default values when creating or resetting metadata.
     */
    static defaults = {

    }

    /**
     * Reset the metadata to default values.
     */
    reset() {
        Object.assign(this, SearchEngineMetadata.defaults);
    }

    /**
     * Creates, updates or removes metadata nodes.
     */
    apply() {
        document.title = [this.titlePrefix, this.title, this.titleSuffix].filterEmpty().join(' ').trim();
        let route = Router.current.route;
        let image = (this.image != null)
            ? Routes.image.uri.relative({ id: this.image, size: 'original' })
            : '/images/logo.png';

        let metadata = [
            { name: 'og:title',         attribute: 'property',  value: document.title },
            { name: 'robots',           attribute: 'name',      value: this.robots },
            { name: 'description',      attribute: 'name',      value: this.description },
            { name: 'og:description',   attribute: 'property',  value: this.description },
            { name: 'og:type',          attribute: 'property',  value: this.type },
            { name: 'og:section',       attribute: 'property',  value: this.section },
            { name: 'og:modified_time', attribute: 'property',  value: this.modifiedTime },
            { name: 'og:image',         attribute: 'property',  value: image },
            { name: 'og:url',           attribute: 'property',  value: (route ? route.uri.canonical(Router.current.params) : null) }
        ];

        document.head.applyMetadata(metadata);
    }
}