/**
 * Manages loading bundles for single page applications.
 */
const BundleManager = {
    bundles: {},

    /**
     * Loads all bundles or assets for a route.
     * @param {Route} route
     */
    loadRouteBundles: async function(route) {
        for (let b of route.bundles) {
            // Load the bundle if it exists
            if (this.bundles.hasOwnPropert(b)) {
                await this.loadBundle(b);
            // Otherwise it is a single asset
            } else {
                await this.load(b);
            }
        }
    },

    /**
     * Loads all assets in a bundle.
     * @param {string} name
     */
    loadBundle: async function(name) {
        let files = BundleManager.bundles[name];
        await BundleManager.load(files);
    },

    /**
     * Load one or many assets.
     * @param {string|string[]} assets
     */
    load: async function load(assets) {
        if (!Array.isArray(assets)) { assets = [assets]; }

        // The function to load JS
        let loadJs = function (asset) {
            return new Promise(function (resolve, reject) {
                let script = document.createElement('script');
                script.onload = resolve;
                script.src = asset;
                document.getElementsByTagName('head')[0].appendChild(script);
            });
        };

        // The function to load CSS
        let loadCss = function (asset) {
            return new Promise(function (resolve, reject) {
                let style = document.createElement('link');
                style.rel = 'stylesheet';
                style.href = asset;
                style.onload = resolve;
                document.getElementsByTagName('head')[0].appendChild(style);
            });
        };

        // Create a list of promises for each asset to be loaded
        let promises = [];
        for (let asset of assets) {
            switch (asset.getExtension()) {
                case 'js':
                    // Skip if already loaded
                    if (document.querySelector('head script[src="' + asset + '"]') != null) { continue; }
                    promises.push(loadJs(asset));
                    break;
                case 'css':
                    // Skip if already loaded
                    if (document.querySelector('head style[href="' + source + '"]') != null) { continue; }
                    promises.push(loadCss(asset));
                    break;
            }
        }

        // Execute all promises
        await Promise.all(promises);
    }
}