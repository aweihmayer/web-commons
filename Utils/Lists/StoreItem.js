/**
 * Defines an object kept in a store. 
 */
class StoreItem {
    /**
     * Gets the id of the item.
     * @returns {any}
     */
    getId() {
        return this.id;
    }

    /**
     * Determines if the item is searchable.
     * @returns {boolean}
     */
    isSearchable() {
        return (this.system && this.system.searchable);
    }

    /**
     * Gets the search value of the item for Fuse JS fuzzy search.
     * @returns {string}
     */
    getSearchValue() {
        return this.id;
    }

    /**
     * Casts a generic object into this class.
     * @param {object} obj
     */
    cast(obj) {
        // If the obj is already of this type, there is nothing to do
        if (this.constructor.prototype.isPrototypeOf(obj)) { return obj; }

        // Convert the object
        let proto = Object.getPrototypeOf(this);
        let entity = Object.create(proto);
        // Assign properties
        Object.assign(entity, obj);

        return entity;
    }
}