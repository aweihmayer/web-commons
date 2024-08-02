class CommonUserDto {
    constructor(data) {
        Object.assign(this, data);

        user.tokens.forEach(t => {
            this.expirationDate = Date.now(this.expirationDate);
            delete t.id;
            t.getRemainingDuration = function () { return this.expirationDate - Date.now() };
        });
    }
}