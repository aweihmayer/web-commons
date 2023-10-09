class PaginationHelper {
    /**
     * @param {object[]|number} [items] If items is a number, it is the total count of items.
     * @param {number} [itemsPerPage]
     * @param {number} [currentPage]
     * @oaram {number} [numberOfPagesDisplayed] The number of pages displayed.
     */
    constructor(items, itemsPerPage, currentPage, numberOfPagesDisplayed) {
        this.items = items || [];
        this.itemsPerPage = itemsPerPage || 10;
        this.currentPage = currentPage || 1;

        // The number of pages displayed must be an odd number
        // This is because the current page must ideally show the previous and next page in order to make nice centered paginaton
        this.numberOfPagesDisplayed = numberOfPagesDisplayed || 5;
        if ((this.numberOfPagesDisplayed % 2) == 0) { this.numberOfPagesDisplayed--; }
    }

    /**
     * Gets the items that should be shown on the current page.
     * @returns {object[]}
     */
    getItemsForCurrentPage() {
        return this.items.slice(this.getOffset(), this.itemsPerPage);
    }

    /**
     * Gets the offset to start taking objects from the correct index.
     * @returns {number}
     */
    getOffset() {
        return ((this.currentPage - 1) * this.itemsPerPage);
    }

    /**
     * Gets the range of items displayed on the current page.
     * @returns {number[]} A array of 2 elements, the first being the offset and the second being the index of the last item on the page.
     */
    getItemRange() {
        return [this.getIndexOfFirstItemOnCurrentPage(), this.getIndexOfLastItemOnCurrentPage()];
    }

    /**
     * Gets the count of items.
     * @returns {number}
     */
    getItemCount() {
        return Array.isArray(this.items) ? this.items.length : this.items;
    }

    /**
     * Gets the index of the first item on the current page.
     * For example, if you were on page 2 with 10 items per page, the index would be 11.
     * @returns {number}
     */
    getIndexOfFirstItemOnCurrentPage() {
        return ((this.currentPage - 1) * this.itemsPerPage) + 1;
    }

    /**
     * Gets the index of the last item on the current page.
     * For example, if you were on page 2 with 10 items per page, the index would be 20.
     * @returns {number}
     */
    getIndexOfLastItemOnCurrentPage() {
        let index = this.getOffset() + this.itemsPerPage;
        let itemCount = this.getItemCount();
        return (index > itemCount) ? itemCount : index;
    }

    /**
     * Gets the page that would display the item index.
     * @param {number} index
     * @returns {number}
     */
    getPageOfItemByIndex(index) {
        return Math.ceil(index / this.itemsPerPage);
    }

    /**
     * Sets the number of items displayed per page.
     * @param {number} itemsPerPage
     * @param {boolean} [preserveLocation] Default true. If true, sets the current page to where we previously were, otherwise sets the current page to the first page.
     */
    setItemsPerPage(itemsPerPage, preserveLocation) {
        preserveLocation = (typeof preserveLocation === 'undefined') ? true : preserveLocation;
        let oldIndex = preserveLocation ? this.getIndexOfFirstItemOnCurrentPage() : 1;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = this.getPageOfItemByIndex(oldIndex);
    }

    /**
     * Gets the total page count depending on the count of items and the items per page.
     * @returns {number}
     */
    getPageCount() {
        return Math.ceil(this.getItemCount() / this.itemsPerPage);
    }

    /**
     * Gets the page before the current page.
     * @returns {number}
     */
    getPreviousPage() {
        return this.isAtFirstPage() ? 1 : (this.currentPage - 1);
    }

    /**
     * Gets the page after the current page.
     * @returns {number}
     */
    getNextPage() {
        return this.isAtLastPage() ? this.getPageCount() : (this.currentPage + 1);
    }

    /**
     * Determines if the current page is the first.
     * @returns {bool}
     */
    isAtFirstPage() {
        return (this.currentPage === 1);
    }

    /**
     * Determines if the current page is the last.
     * @returns {bool}
     */
    isAtLastPage() {
        return (this.currentPage === this.getPageCount());
    }

    /**
     * Gets the pages that should be displayed.
     * Inserts placeholders to seperate normal pagination from skipping to the first page or last page.
     * @returns {number[]}
     */
    getDisplayedPages() {
        let pageCount = this.getPageCount();
        let left = {};
        let right = {};

        // The number of pages we take from each side
        left.take = (this.numberOfPagesDisplayed - 1) / 2;
        right.take = left.take;

        // The number of pages on each side
        left.available = (this.currentPage - 1);
        right.available = (pageCount - this.currentPage);

        // If we don't have enough to take from the left side
        if (left.available < left.take) {
            // Give more to the other side
            right.take += left.take - left.available;
            // Take only what's available
            left.take = left.available;
        }

        // If we don't have enough to take from the right side
        if (right.available < right.take) {
            // Give more to the other side
            left.take += right.take - right.available;
            // Take only what's available
            right.take = right.available;
        }

        // If we don't have enough on the left side, take only what is available
        if (left.available < left.take) { left.take = left.available; }

        // Get the pages that should be displayed
        let pages = [];
        let startingPage = (this.currentPage - left.take);
        let endingPage = (startingPage + left.take + right.take);

        // If the starting page is not the first, add the first page and create a null placeholder
        if (startingPage !== 1) {
            pages.push(1);
            pages.push(null);
        }

        for (let i = startingPage; i <= endingPage; i++) {
            pages.push(i);
        }

        // If the ending page is not the last, and a null placeholder and the last page
        if (endingPage !== pageCount) {
            pages.push(null);
            pages.push(pageCount);
        }

        return pages;
    }
}