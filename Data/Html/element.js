/**
 * Shows an element by removing the hidden class.
 */
Element.prototype.show = function () { this.classList.remove('hidden'); };

/**
 * Hides an element by adding the hidden class.
 */
Element.prototype.hide = function () { this.classList.add('hidden'); };

/**
 * Determines if an element is hidden by checking if it has the hidden class or if it is contained by an element who does.
 * @returns {boolean}
 */
Element.prototype.isHidden = function () { return this.closest('.hidden') != null };