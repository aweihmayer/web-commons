using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace WebCommons.Api
{
	public class HttpRequest
	{
		/// <summary>
		/// The request's endpoint.
		/// <example>/article/{id}</example>
		/// </summary>
		public string Endpoint { get; set; }

		/// <summary>
		/// The request's HTTP method.
		/// GET requests cannot have a content body.
		/// </summary>
		public HttpMethod Method { get; set; }

		/// <summary>
		/// The request's query.
		/// Query parameters can replace placeholders in the uri.
		/// The remaining parameters will be added as a query string.
		/// The query can be <see cref="Dictionary{string, object}" /> or a custom object.
		/// </summary>
		public object? Query { get; set; }

		public object? DefaultQuery { get; set; }

        /// <summary>
        /// The request's model.
        /// It can contain both query and content parameters simultaneously.
        /// If the model is a <see cref="Dictionary{string, object}" />, it is only a request body.
        /// If the model is a custom object, properties that are for the query string must have a <see cref="FromQueryAttribute" />.
        /// If the method is not GET, the model will be serialized as JSON and added to the content body.
        /// </summary>
        public object? Model { get; set; }

		public object? DefaultModel { get; set; }

		/// <summary>
		/// The request's headers.
		/// </summary>
		public Dictionary<string, string> Headers { get; set; } = new Dictionary<string, string>();

		public HttpRequest(string endpoint, HttpMethod method, object? query = null, object? model = null, object? defaultQuery = null, object? defaultModel = null)
		{
			this.Endpoint = endpoint;
			this.Method = method;
			this.Query = query;
			this.Model = model;
			this.DefaultQuery = defaultQuery;
			this.DefaultModel = defaultModel;
		}

		/// <summary>
		/// Builds request usable by a HTTP client.
		/// </summary>
        public HttpRequestMessage Build()
		{
			Dictionary<string, object> query = this.BuildQuery();
			string uri = this.BuildEndpoint(query);

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
			if (this.Method == HttpMethod.Patch) request.Headers.ExpectContinue = false;

			return request;
		}
		
		/// <summary>
		/// Builds the query parameters.
		/// </summary>
		protected Dictionary<string, object> BuildQuery()
		{
			Dictionary<string, object> query = this.Query.GetQueryStringParams(false);
			// Add model query params
			foreach (var param in this.Model.GetQueryStringParams(true)) query.Add(param.Key, param.Value);
			// Add default query params
			foreach (var param in this.DefaultQuery.GetQueryStringParams(false)) query.Add(param.Key, param.Value);
			// Add default model params
			foreach (var param in this.DefaultModel.GetQueryStringParams(true)) query.Add(param.Key, param.Value);

			return query;
		}

		/// <summary>
		/// Builds the full URI.
		/// Query parameters can replace placeholders in the URI and will be removed from the query string if they are.
		/// </summary>
		protected string BuildEndpoint(Dictionary<string, object> query)
		{
			string uri = this.Endpoint;

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

			return headers;
        }

		/// <summary>
		/// Creates a string that represents the request.
		/// </summary>
        public override string ToString()
		{
			HttpRequestMessage request = this.Build();
            return string.Format("[{0}] Request {1} {2} {3}",
                DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm"),
                request.Method.ToString(),
                (request.RequestUri == null) ? "/" : request.RequestUri.ToString(),
                (request.Content == null) ? string.Empty : request.Content.ToString());
		}
	}
}