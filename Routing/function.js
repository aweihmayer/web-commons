Object.defineProperty(window.location, 'relativeHref', {
    get: function () { return this.pathname + this.search; },
    enumerable: false
});