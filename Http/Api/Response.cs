using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Headers;

namespace WebCommons.Api
{
	/// <summary>
	/// Defines an API response.
	/// This is useful because the content of a response is not deserialized and has to be read asynchronously.
	/// Instead, this will read and deserialize the content once only.
	/// </summary>
	/// <typeparam name="T">The deserialized content type.</typeparam>
	public class HttpResponse<T>
	{
		public HttpStatusCode StatusCode { get; set; }
		public bool IsSuccessStatusCode { get; set; }
		public HttpResponseHeaders Headers { get; set; }
		public TimeSpan Duration { get; set; }
		public T? Content { get; set; }

		public HttpResponse(HttpResponseMessage response, string content, TimeSpan duration) : this(response)
		{
			this.Duration = duration;
			this.Content = !string.IsNullOrEmpty(content) ? JsonConvert.DeserializeObject<T>(content) : default;
		}

		public HttpResponse(HttpResponseMessage response)
		{
			this.StatusCode = response.StatusCode;
			this.IsSuccessStatusCode = response.IsSuccessStatusCode;
			this.Headers = response.Headers;
		}

		public HttpResponse(HttpStatusCode statusCode)
		{
			this.StatusCode = statusCode;
			int code = (int) statusCode;
			this.IsSuccessStatusCode = (code >= 200 && code < 300);
			this.Headers = new HttpResponseMessage().Headers;
		}

		public HttpResponse(ResponseException ex) : this(ex.StatusCode) { }

		/// <summary>
		/// Determines if the response content is empty.
		/// </summary>
		public bool IsEmpty() => this.Content == null;

		public ResponseLog ToLog(bool includeContent = true)
		{
			// TODO request info
			return new ResponseLog(
				"",
				"",
				(int) this.StatusCode,
                (int) this.Duration.TotalMilliseconds,
                includeContent ? JsonConvert.SerializeObject(this.Content) : null);
		}

		public ResponseException ToException(bool includeContent = true)
		{
			string message = this.ToLog(includeContent).ToString(includeContent);
            switch (this.StatusCode) {
				case HttpStatusCode.BadRequest:				return new BadRequestException(message);
                case HttpStatusCode.Conflict:				return new ConflictException(message);
                case HttpStatusCode.Forbidden:				return new ForbiddenException(message);
                case HttpStatusCode.Gone:					return new GoneException(message);
                case HttpStatusCode.InternalServerError:	return new InternalErrorException(message);
                case HttpStatusCode.Locked:					return new LockedException(message);
                case HttpStatusCode.NotFound:				return new NotFoundException(message);
                case HttpStatusCode.Unauthorized:			return new UnauthorizedException(message);
				default:									return new ResponseException(this.StatusCode, message);
            }
		}
    }

	public class ResponseLog
	{
        [JsonProperty("method")]
        public string Method { get; set; }

        [JsonProperty("endpoint")]
        public string Endpoint { get; set; }

        [JsonProperty("status")]
        public int Status { get; set; }

        [JsonProperty("duration")]
        public int Duration { get; set; }

        [JsonProperty("content", NullValueHandling = NullValueHandling.Ignore)]
        public object? Content { get; set; }

		public ResponseLog(string method, string endpoint, int status, int duration, object? content)
		{
            this.Method = method;
            this.Endpoint = endpoint;
			this.Duration = duration;
            this.Status = status;
            this.Content = content;
		}

        public string ToString(bool includeContent = true)
        {
			string message = $"Response took {this.Duration}ms with status {this.Status}";
            if (includeContent) return message += $"and content {JsonConvert.SerializeObject(this.Content)}";
            return message;
        }
    }
}