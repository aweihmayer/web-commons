HTMLImageElement.prototype.lazyLoad = function () {
    if (this.src) return;
    else if (!this.dataset.lazyload) return;
    else this.src = this.dataset.lazyload;
};

HTMLIFrameElement.prototype.lazyLoad = function () {
    if (this.src) return;
    else if (!this.dataset.lazyload) return;
    else this.src = this.dataset.lazyload;
};

HTMLPictureElement.prototype.lazyLoad = function () {
    this.lazyLoadAllElements();
};

Element.prototype.getLazyLoadableElements = function () {
    return Array.from(this.querySelectorAll('*[data-lazyload]'));
};

Element.prototype.lazyLoadAllElements = function () {
    this.getLazyLoadableElements().forEach(v => { v.lazyLoad(); });
};