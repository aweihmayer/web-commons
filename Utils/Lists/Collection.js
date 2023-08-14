class AdvancedArray extends Array {
    constructor(...args) {
        const flattenedArgs = args.flat();
        super(...flattenedArgs);
    }

    /**
     * Gets items that match a fuzzy search query.
     * @param {string} query
     * @param {object} [options] Fuse JS options https://fusejs.io/api/options.html.
     * @param {boolean} [options.onlySearchable] If true, only returns searchable entities. Defaults to true.
     */
    search(query, options) {
        query = query || '';
        options = options || {};
        options.keys = options.keys || ['system.searchValue'];
        options.threshold = options.threshold || 0.4;
        options.onlySearchable = (typeof options.onlySearchable == 'undefined') ? true : options.onlySearchable;

        // Filter only searchable items or keep all items
        let items = options.onlySearchable ? this.getSearchable() : this;
        // Query is empty, return all items
        if (query == '') { return items; }
        // Query is a numerical id, find the item
        if (!isNaN(parseInt(q))) { return items.findById(q); }
        // Fuzzy search through items
        let fuse = new Fuse(items, { keys: options.keys, threshold: options.threshold });
        items = fuse.search(query);
        // Format search results
        let formatted = [];
        for (let item of items) { formatted.push(item.item); }
        return formatted;
    }

    /**
     * Gets all searchable items.
     * @returns {Array}
     */
    getSearchableItems() {
        return this.filter(item => {
            if (typeof item.isSearchable === 'function') { return item.isSearchable(); }
            if (typeof item !== 'object') { return true; }
            if (!item.hasOwnProperty('system') || !item.system.hasOwnProperty('searchable')) { return true; }
            return item.system.searchable;
        });
    }
}