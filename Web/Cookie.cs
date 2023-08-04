using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace WebCommons.Data.Web
{
    public abstract class Cookie
    {
        /// <summary>
        /// The name of the cookie.
        /// </summary>
        [JsonIgnore]
        public string Name { get; set; }

        /// <summary>
        /// The value of the cookie in base64.
        /// </summary>
        [JsonIgnore]
        protected string? Value { get; set; }

        /// <summary>
        /// The duration of the cookie.
        /// </summary>
        [JsonIgnore]
        public TimeSpan Duration { get; set; }

        /// <summary>
        /// The request to read the cookie.
        /// </summary>
        [JsonIgnore]
        public HttpRequest? Request { get; set; }

        /// <summary>
        /// The response to create the cookie.
        /// </summary>
        [JsonIgnore]
        public HttpResponse? Response { get; set; }

        protected Cookie(string name, TimeSpan duration, HttpRequest? request = null, HttpResponse? response = null)
        {
            this.Name = name;
            this.Duration = duration;
            this.Init(request, response);
        }

        /// <summary>
        /// Sets the request and response references so that the cookie may be read and created.
        /// </summary>
        public void Init(Controller controller)
        {
            this.Request = controller.Request;
            this.Response = controller.Response;
            if (this.Request != null) { this.Read(); }
        }

        /// <summary>
        /// Sets the request and response references so that the cookie may be read and created.
        /// </summary>
        public void Init(HttpRequest? request = null, HttpResponse? response = null)
        {
            this.Request = request;
            this.Response = response;
            if (this.Request != null) { this.Read(); }
        }

        /// <summary>
        /// If the cookie exists, decode the value as base64 and deserialize it.
        /// </summary>
        public virtual void Read(HttpRequest request = null)
        {
            if (request != null) { this.Request = request; }
            if (!this.Exists()) { return; }
            this.Value = this.Request.Cookies[this.Name];
            byte[] bytes = Convert.FromBase64String(this.Value);
            this.Value = Encoding.UTF8.GetString(bytes);
            try {
                JsonConvert.PopulateObject(this.Value, this);
            } catch (Exception) {
                
            }
        }

        /// <summary>
        /// Adds the cookie to the response as a base64 encoded value.
        /// </summary>
        public virtual void Create(HttpResponse? response = null)
        {
            if (response != null) { this.Response = response; }
            this.Value = JsonConvert.SerializeObject(this);
            byte[] bytes = Encoding.UTF8.GetBytes(this.Value);
            string value = Convert.ToBase64String(bytes);
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
        /// Determines if the cookie exists.
        /// </summary>
        public bool Exists()
        {
            return (this.Request.Cookies[this.Name] != null);
        }
    }
}