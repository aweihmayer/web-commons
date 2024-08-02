Stores.auth = {
    /**
     * Retrieves the user from the local cache.
     * @returns {CommonUserDto}
     */
    get user() {
        if (this._user !== null) return this._user;
        this._user = this.userCache.retrieve();
        return this._user;
    },

    /**
     * Stores the user in the local cache.
     * @param {CommonUserDto} user
     */
    set user(user) {
        this._user = user;
        this.userCache.put(user);
    },

    _user: null,
    userCache: new LocalStorageValue('user'),

    refresh: function () {
        return Routes.api.auth.refresh.fetch()
            .then(response => {
                this.user = response.json;
                return response;
            }).catch(response => {
                this._user = null;
                this.userCache.clear();
            });
    },

    isAuthenticated: function () {
        return (this.user != null && this.getRemainingDuration() > 0);
    },

    getRemainingDuration: function () {
        if (this.user === null) return 0;
        let accessToken = this.user.tokens.find(t => t.type === 'access');
        return accessToken.expirationDate - Date.now();
    },

    silentlyRefreshAcessToken: function () {
        setTimeout(() => { this.silentlyRefreshAcessToken() }, 10000);
        if (!this.isAuthenticated()) return;
        let remainingPercentage = this.getRemainingDuration() / 1800000;
        if (remainingPercentage > 0.25) return;
        this.refresh();
    },

    beforeRouteChangeAuthentification: function (newRouting) {
        if (Store.auth.isAuthenticated()) return;
        newRouting.code = 401;
        newRouting.route = Routes.error['401'];
    }
};