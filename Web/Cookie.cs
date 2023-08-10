﻿using Microsoft.AspNetCore.Http;
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
        /// Determines if the cookie value is empty.
        /// </summary>
        public bool IsEmpty()
        {
            return (this.Value == null);
        }

        // TODO build options method
    }
}