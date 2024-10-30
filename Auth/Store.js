Stores.auth = {
    /**
     * Retrieves the user from the local cache.
     */
    get user() {
        if (this._user !== null) return this._user;
        this._user = this.userCache.retrieve();
        return this._user;
    },

    /**
     * Stores the user in the local cache.
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

    authenticateRoute: function (routing) {
        if (Store.auth.isAuthenticated()) return;
        routing.code = 401;
        routing.route = Routes.error['401'];
    }
};