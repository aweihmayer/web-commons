HTMLImageElement.prototype.lazyLoad = () => {
    if (this.src) { return; }
    if (!this.dataset.lazyload) { return; }
    this.src = this.dataset.lazyload;
};

HTMLPictureElement.prototype.lazyLoad = () => {
    this.lazyLoadAllElements();
};

Element.prototype.getLazyLoadableElements = () => this.querySelectorAll('*[data-lazyload]');

Element.prototype.lazyLoadAllElements = () => {
    this.getLazyLoadableElements().foreach(v => { v.lazyLoad(); });
}