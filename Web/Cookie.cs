using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Reflection;

namespace WebCommons.Web
{
    /// <summary>
    /// Defines a cookie. To manipulate cookies, see <see cref="CookieExtensions">extensions</see>.
    /// </summary>
    /// <typeparam name="T"></typeparam>
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
                if (this.Value == null) { return string.Empty; }
                string value = JsonConvert.SerializeObject(this.Value);
                value = value.EncodeBase64();
                return value;
            }
            set {
                value = value.DecodeBase64();
                this.Value = JsonConvert.DeserializeObject<T>(value);
            }
        }

        protected Cookie(string name, TimeSpan duration)
        {
            this.Name = name;
            this.Duration = duration;
        }

        /// <summary>
        /// Adds the cookie to the response as a base64 encoded value.
        /// </summary>
        public virtual void Create()
        {
            if (this.Value == null) { return; }
            string value = JsonConvert.SerializeObject(this.Value);
            value = value.EncodeBase64();
            CookieOptions options = new();
            options.Expires = DateTime.UtcNow.Add(this.Duration);
            this.Response.Cookies.Append(this.Name, value, options);
        }

        /// <summary>
        /// Deletes the cookie.
        /// </summary>
        public void Delete()
        {
            this.Response.Cookies.Delete(this.Name);
        }

        /// <summary>
        /// Determines if the cookie value is empty.
        /// </summary>
        public bool IsEmpty()
        {
            return (this.Value == null);
        }

        /// <summary>
        /// If the cookie exists, decode the value as base64 and deserialize it.
        /// </summary>
        public virtual void Read(HttpRequest? request = null)
        {
            if (!this.Exists()) { return; }
            string? value = this.Request.Cookies[this.Name];
            if (string.IsNullOrEmpty(value)) { return; }
            value = value.DecodeBase64();
            this.Value = JsonConvert.DeserializeObject<T>(value);
        }
    }
}