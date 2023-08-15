/**
 * Gets items that match a fuzzy search query.
 * @param {Array} items
 * @param {string} query
 * @param {object} [options] Fuse JS options https://fusejs.io/api/options.html.
 */
function fuzzySearch(items, query, options) {
    query = query || '';
    options = options || {};
    options.keys = options.keys || ['system.searchValue'];
    options.threshold = options.threshold || 0.4;

    // Query is empty, return all items
    if (query == '') { return items; }
    // Fuzzy search through items
    let fuse = new Fuse(items, { keys: options.keys, threshold: options.threshold });
    items = fuse.search(query);
    // Format search results
    let formatted = [];
    for (let item of items) { formatted.push(item.item); }
    return formatted;
}