/**
 * Gets the last element of the array.
 * @returns {any}
 */
Object.defineProperty(Array.prototype, 'last', {
    enumerable: false,
    value: function () {
        return this[this.length - 1];
    }
});

/**
 * Determines if the array has any values.
 * @returns {boolean}
 */
Object.defineProperty(Array.prototype, 'isEmpty', {
    enumerable: false,
    value: function () {
        return (this.length === 0);
    }
});

/**
 * Returns a new array with no null or empty string values.
 * @returns {Array}
 */
Object.defineProperty(Array.prototype, 'filterEmpty', {
    enumerable: false,
    value: function () {
        return this.filter(v => (v !== null && v !== ''));
    }
});

Array.createStore = (array) => {
    if (typeof array === 'undefined') { array = []; }

    /**
     * Gets all searchable items.
     * @returns {Array}
     */
    Object.defineProperty(array, 'getSearchable', {
        enumerable: false,
        value: function () {
            return this.filter(item => {
                if (typeof item.isSearchable === 'function') { return item.isSearchable(); }
                if (typeof item !== 'object') { return true; }
                if (!item.hasOwnProperty('system') || !item.system.hasOwnProperty('searchable')) { return true; }
                return item.system.searchable;
            });
        }
    });

    /**
     * Gets items that match a fuzzy search query.
     * @param {string} query
     * @param {object} [options] Fuse JS options https://fusejs.io/api/options.html.
     * @param {boolean} [options.onlySearchable] If true, only returns searchable entities. Defaults to true.
     */
    Object.defineProperty(array, 'search', {
        enumerable: false,
        value: function (query, options) {
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
    });

    /**
     * Gets one item by query.
     * @param {any} query
     * @returns {object}
     */
    Object.defineProperty(array, 'findByQuery', {
        enumerable: false,
        value: function (query) {
            let item = (typeof query === 'object')
                ? this.find(item => (item.equals(query)))
                : this.findById(query);
            return (typeof item === 'undefined') ? null : item;
        }
    });

    /**
     * Gets one item by id.
     * @param {any} id
     * @returns {object}
     */
    Object.defineProperty(array, 'findById', {
        enumerable: false,
        value: function (id) {
            let item = this.find(item => {
                if (typeof item.getId === 'function') { return item.getId() == id; }
                if (item.hasOwnProperty('id')) { return item.id == id; }
                return false;
            });
            return (typeof item === 'undefined') ? null : item;
        }
    });

    /**
     * The item class. Generic objects will be cast as this model when using the add function.
     */
    Object.defineProperty(array, 'model', {
        enumerable: false,
        value: null
    });

    /**
     * Adds or updates an item in the array. The item will be cast as the model.
     * @param {object} item
     */
    Object.defineProperty(array, 'add', {
        enumerable: false,
        value: function (item) {
            // Item is an array, add multiple
            if (Array.isArray(item)) {
                for (let i of item) { this.add(i); }
                return;
            }

            // Generic objects are converted
            if (this.model != null) { item = this.model.cast(item); }
            // Set the search value
            if (!item.hasOwnProperty('system')) { item.system = {}; }
            if (typeof item.isSearchable === 'function') {
                item.system.searchValue = item.getSearchValue();
            } else if (item.hasOwnProperty('name')) {
                item.system.searchValue = item.name;
            } else if (item.hasOwnProperty('id')) {
                item.system.searchValue = item.id;
            }
            // Determine whether to add or update
            let existingItem = null;
            if (typeof item.getId === 'function') {
                existingItem = this.find(item.getId());
            } else if (item.hasOwnProperty('id')) {
                existingItem = this.find(item.id);
            }
            // Item exists, update it
            if (existingItem !== null) { Object.assign(existingItem, item); }
            // Otherwise add it
            else { this.push(item); }
        }
    });

    /**
     * Removes an item from the store.
     * @param {any} item
     */
    Object.defineProperty(array, 'remove', {
        enumerable: false,
        value: function (item) {
            // Item is an array, remove multiple
            if (Array.isArray(item)) {
                for (let i of item) { this.remove(i); }
                return;
            }
            // TODO
            // Get the id
            let id;
            if (typeof item !== 'object' || Array.isArray(item)) {
                id = item;
            } else {
                item = this.type.convert(item);
                id = item.getId();
            }

            this.items = this.items.filter(item => item.equals(id));
        }
    });

    return array;
};