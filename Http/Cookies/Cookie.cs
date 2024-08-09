using Newtonsoft.Json;

namespace WebCommons.Http
{
    /// <summary>
    /// Defines a cookie. To manipulate cookies, see <see cref="CookieExtensions">extensions</see>.
    /// </summary>
    /// <typeparam name="T">The value type.</typeparam>
    public abstract class Cookie<T>
    {
        /// <summary>
        /// The name of the cookie.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The duration of the cookie.
        /// </summary>
        public TimeSpan Duration { get; set; }

        /// <summary>
        /// The value of the cookie.
        /// </summary>
        public T? Value { get; set; }

        public string Base64Value
        {
            get {
                if (this.Value == null) return string.Empty;
                string value = JsonConvert.SerializeObject(this.Value);
                return value.EncodeBase64();
            }
            set {
                value = value.DecodeBase64();
                this.Value = JsonConvert.DeserializeObject<T>(value);
            }
        }

        /// <summary>
        /// A HTTP-only cookie is a cookie that cannot be accessed by client-side scripts such as JS. This makes the cookie more secure. 
        /// </summary>
        public bool IsHttpOnly { get; set; } = false;

        /// <summary>
        /// Defines the scope of a cookie within a website. The path restricts the cookie to be sent to only certain URLs.
        /// </summary>
        public string? Path { get; set; }

        protected Cookie(string name, TimeSpan duration)
        {
            this.Name = name;
            this.Duration = duration;
        }

        /// <summary>
        /// Determines if the cookie value is empty.
        /// </summary>
        public bool IsEmpty() => (this.Value == null);
    }
}