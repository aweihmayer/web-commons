class AuthCookie extends CookieBase {
    constructor() {
        super('auth', 10080);
    }
}