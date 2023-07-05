/**
 * Defines the HTML page metadata for search engines.
 */
class SearchEngineMetadata {
    constructor() {
        this.reset();
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
        title: '',
        titlePrefix: '',
        titleSuffix: '',
        robots: SearchEngineMetadata.robots.follow,
        type: SearchEngineMetadata.type.website,
        modifiedTime: null,
        section: null,
        description: null,
        image: null
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
        document.title = (this.titlePrefix + ' ' + this.title + ' ' + this.titleSuffix).trim();
        let route = Router.current.route;
        let image = (this.image != null)
            ? Routes.image.path({ id: this.image, size: 'original' })
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
            { name: 'og:url',           attribute: 'property',  value: (route ? route.canonicalPath(Router.current.params) : null) }
        ];

        document.applyMetadata(metadata);
    }
}