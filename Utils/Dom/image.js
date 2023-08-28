/**
 * 
 */
HTMLImageElement.prototype.lazyload = () => {
    if (this.src) { return; }
    if (!this.dataset.src) { return; }
    this.src = this.dataset.src;
};

HTMLPictureElement.prototype.lazyload = () => {
    this.getImages().foreach(v => { v.lazyload(); });
};

/**
 * Gets all image child elements.
 */
Element.prototype.getImages = function () {
    this.querySelectorAll('img, picture');
};