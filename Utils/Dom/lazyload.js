HTMLImageElement.prototype.lazyLoad = function () {
    if (this.src) { return; }
    if (!this.dataset.lazyload) { return; }
    this.src = this.dataset.lazyload;
};

HTMLPictureElement.prototype.lazyLoad = function () {
    this.lazyLoadAllElements();
};

Element.prototype.getLazyLoadableElements = function () {
    this.querySelectorAll('*[data-lazyload]');
};

Element.prototype.lazyLoadAllElements = function () {
    this.getLazyLoadableElements().foreach(v => { v.lazyLoad(); });
};