class Cookie {
    /**
     * @param {string} name
     * @param {number} duration The duration of the cookie in seconds.
     */
    constructor(name, duration) {
        this.name = name;
        this.duration = duration;
        this.value = null; // The value of the cookie is base64
        this.read();
    }

    /**
     * Reads, decodes, deserializes and sets the value of the cookie.
     */
    read() {
        // Do nothing if the cookie does not exist
        if (!this.exists()) return;
        // Find the cookie
        let result = document.cookie.match("(^|[^;]+)\\s*" + this.name + "\\s*=\\s*([^;]+)");
        this.value = result ? result.pop() : null;
        // Do nothing if the cookie value was not found. This is unexpected
        if (this.value === null) return;
        // Decode the base64 value
        let decodedValue = atob(this.value);
        try {
            // Deserialize the value and set the properties of the cookie with it
            let json = JSON.parse(decodedValue);
            Object.assign(this, json);
        } catch {
            console.error('Unable to parse cookie ' + this.name);
        }
    }

    /**
     * Determines if the cookie exists.
     * @returns {boolean} True if the cookie exists, otherwise false.
     */
    exists() {
        return (document.cookie.indexOf(this.name + '=') != -1);
    }

    /**
     * Creates the cookie as a base64 encoded value.
     */
    create() {
        const now = new Date();
        let expiration = new Date();
        expiration.setTime(now + (this.duration * 1000));
        document.cookie = this.name + '=' + btoa(this.value) + '; expires=' + expiration.toUTCString() + '; path=/;';
    }

    /**
     * Deletes the cookie.
     */
    delete() {
        document.cookie = this.name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=localhost;';
    }
}