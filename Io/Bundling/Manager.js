﻿/**
 * Manages loading bundles for single page applications.
 */
const BundleManager = {
    bundles: {},

    /**
     * Loads all bundles.
     * @param {string[]} bundles
     */
    loadBundles: async function(bundles) {
        for (let b of bundles) {
            if (this.bundles.hasOwnPropert(b)) await this.loadBundle(b);
            else await this.load(b);
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
        if (!Array.isArray(assets)) assets = [assets];

        // Create a list of promises for each asset to be loaded
        let promises = [];
        for (let asset of assets) {
            let extension = asset.split('.');
            extension = extension.last();

            switch (extension) {
                case 'js':
                    promises.push(loadJs(asset));
                    break;
                case 'css':
                    promises.push(loadCss(asset));
                    break;
            }
        }

        // Execute all promises
        await Promise.all(promises);
    },

    loadJs: function (asset) {
        return new Promise(function (resolve, reject) {
            if (document.querySelector('head script[src="' + asset + '"]') != null) return;
            let script = document.createElement('script');
            script.onload = resolve;
            script.src = asset;
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    },

    loadCss: function (asset) {
        return new Promise(function (resolve, reject) {
            if (document.querySelector('head style[href="' + source + '"]') != null) continue;
            let style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = asset;
            style.onload = resolve;
            document.getElementsByTagName('head')[0].appendChild(style);
        });
    }
}