class TimeSpan {
    constructor(milliseconds = 0) {
        this.milliseconds = milliseconds;
    }

    static fromDays(days) {
        return new TimeSpan(days * 24 * 60 * 60 * 1000);
    }

    static fromHours(hours) {
        return new TimeSpan(hours * 60 * 60 * 1000);
    }

    static fromMinutes(minutes) {
        return new TimeSpan(minutes * 60 * 1000);
    }

    static fromSeconds(seconds) {
        return new TimeSpan(seconds * 1000);
    }

    static fromMilliseconds(milliseconds) {
        return new TimeSpan(milliseconds);
    }

    getTotalDays() {
        return this.milliseconds / (24 * 60 * 60 * 1000);
    }

    getTotalHours() {
        return this.milliseconds / (60 * 60 * 1000);
    }

    getTotalMinutes() {
        return this.milliseconds / (60 * 1000);
    }

    getTotalSeconds() {
        return this.milliseconds / 1000;
    }

    getTotalMilliseconds() {
        return this.milliseconds;
    }

    getDays() {
        return Math.floor(this.milliseconds / (24 * 60 * 60 * 1000));
    }

    getHours() {
        return Math.floor((this.milliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    }

    getMinutes() {
        return Math.floor((this.milliseconds % (60 * 60 * 1000)) / (60 * 1000));
    }

    getSeconds() {
        return Math.floor((this.milliseconds % (60 * 1000)) / 1000);
    }

    getMilliseconds() {
        return this.milliseconds % 1000;
    }

    add(timeSpan) {
        return new TimeSpan(this.milliseconds + timeSpan.getTotalMilliseconds());
    }

    subtract(timeSpan) {
        return new TimeSpan(this.milliseconds - timeSpan.getTotalMilliseconds());
    }

    toString() {
        return `${this.getDays()}d ${this.getHours()}h ${this.getMinutes()}m ${this.getSeconds()}s ${this.getMilliseconds()}ms`;
    }

    toJSON() {
        return this.getTotalMilliseconds();
    }

    valueOf() {
        return this.getTotalMilliseconds();
    }
}