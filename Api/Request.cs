﻿using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;
using WebCommons.Model;

namespace WebCommons.Api
{
	public class ApiRequest
	{
		/// <summary>
		/// The request's endpoint.
		/// <example>/article/{id}</example>
		/// </summary>
		public string Endpoint { get; set; } = string.Empty;

		/// <summary>
		/// The request's HTTP method.
		/// GET requests cannot have a content body.
		/// </summary>
		public HttpMethod Method { get; set; } = HttpMethod.Get;

		/// <summary>
		/// The request's query.
		/// Query parameters can replace placeholders in the uri.
		/// The remaining parameters will be added as a query string.
		/// The query can be <see cref="Dictionary{string, object}" /> or a custom object.
		/// </summary>
		public object Query { get; set; }

        /// <summary>
        /// The request's model.
        /// It can contain both query and content parameters simultaneously.
        /// If the model is a <see cref="Dictionary{string, object}" />, it is only a request body.
        /// If the model is a custom object, properties that are for the query string must have a <see cref="FromQueryAttribute" />.
        /// If the method is not GET, the model will be serialized as JSON and added to the content body.
        /// </summary>
        public object Model { get; set; }

		/// <summary>
		/// The request's headers.
		/// </summary>
		public Dictionary<string, string> Headers { get; set; } = new Dictionary<string, string>();

        /// <summary>
        /// The API that this request belongs to.
        /// </summary>
        public Api Api { get; set; }

		public ApiRequest() { }

		public ApiRequest(string endpoint, HttpMethod method)
		{
			this.Endpoint = endpoint;
			this.Method = method;
		}

		/// <summary>
		/// Builds request usable by a HTTP client.
		/// </summary>
        public HttpRequestMessage Build()
		{
			Dictionary<string, object> query = this.BuildQuery();
			string uri = this.BuildUri(query);

			// Create the request
			HttpRequestMessage request = new(this.Method, uri);

			// Set the content body if the method is not GET
			if (this.Method != HttpMethod.Get) {
				string stringContent = JsonConvert.SerializeObject(this.Model);
				if (!string.IsNullOrEmpty(stringContent)) {
					request.Content = new StringContent(stringContent, Encoding.UTF8, "application/json");
				}
			}

			// Set the headers
			foreach (KeyValuePair<string, string> header in this.BuildHeaders()) {
				switch (header.Key) {
					case "Accept":	request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue(header.Value)); break;
					default:		request.Headers.Add(header.Key, header.Value); break;
				}
			}

			// Fixes issues with sending "Expect 100-continue" header to APIs that don't support it
			if (this.Method == HttpMethod.Patch) { request.Headers.ExpectContinue = false; }

			return request;
		}
		
		/// <summary>
		/// Builds the query parameters.
		/// </summary>
		protected Dictionary<string, object> BuildQuery()
		{
			Dictionary<string, object> query = this.Query.GetQueryStringParams(false);
			// Add model query params
			foreach (KeyValuePair<string, object> param in this.Model.GetQueryStringParams(true)) {
				query.Add(param.Key, param.Value);
			}
			// Add default query params
			foreach (KeyValuePair<string, object> param in this.Api.Defaults.Query.GetQueryStringParams(false)) {
				query.Add(param.Key, param.Value);
			}
			// Add default model params
			foreach (KeyValuePair<string, object> param in this.Api.Defaults.Model.GetQueryStringParams(true)) {
				query.Add(param.Key, param.Value);
			}

			return query;
		}

		/// <summary>
		/// Builds the full URI.
		/// Query parameters can replace placeholders in the URI and will be removed from the query string if they are.
		/// </summary>
		protected string BuildUri(Dictionary<string, object> query)
		{
			string uri = this.Api.BaseURI + this.Endpoint;

			// Replace placeholders in the URI with query parameter value and remove the parameter
			foreach (KeyValuePair<string, object> param in query) {
				string placeholder = "{" + param.Key + "}";
				if (!uri.Contains(placeholder)) { continue; }
				uri = uri.Replace(placeholder, param.Value.ToString());
				query.Remove(param.Key);
			}

			// Add the query string to the uri
			uri += query.ToQueryString();
			return uri;
		}

		/// <summary>
		/// Builds the request headers.
		/// </summary>
		protected Dictionary<string, string> BuildHeaders()
		{
            Dictionary<string, string> headers = new();
            // Add headers
            foreach (KeyValuePair<string, string> header in this.Headers) {
                headers.Add(header.Key, header.Value);
            }
            // Add default headerss
            foreach (KeyValuePair<string, string> header in this.Api.Defaults.Headers) {
                headers.Add(header.Key, header.Value);
            }

			return headers;
        }

        public override string ToString()
		{
			HttpRequestMessage request = this.Build();
            return string.Format("Request {0} {1} {2}",
				request.RequestUri.ToString(),
				request.Method.ToString(),
				request.Content.ToString());
		}
	}
}