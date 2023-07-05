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
	/// <typeparam name="T">The deserialiazed content type.</typeparam>
	public class ApiResponse<T>
	{
		public HttpStatusCode StatusCode { get; set; }
		public bool IsSuccessStatusCode { get; set; }
		public HttpResponseHeaders Headers { get; set; }
		public TimeSpan Duration { get; set; }
		public T? Content { get; set; }

		public ApiResponse(HttpResponseMessage response, string content, TimeSpan duration) : this(response)
		{
			this.Duration = duration;
			if (!string.IsNullOrEmpty(content)) {
				this.Content = JsonConvert.DeserializeObject<T>(content);
			}
		}

		public ApiResponse(HttpResponseMessage response)
		{
			this.StatusCode = response.StatusCode;
			this.IsSuccessStatusCode = response.IsSuccessStatusCode;
			this.Headers = response.Headers;
		}

		public ApiResponse(HttpStatusCode statusCode)
		{
			this.StatusCode = statusCode;
			int code = (int) statusCode;
			this.IsSuccessStatusCode = (code >= 200 && code < 300);
			this.Headers = new HttpResponseMessage().Headers;

		}

		/// <summary>
		/// Determines if the response content is empty.
		/// </summary>
		public bool IsEmpty()
		{
			return this.Content == null;
		}

        public override string ToString()
        {
			return string.Format("Response took {0}ms and returned {1} {2}",
				this.Duration.Milliseconds.ToString(),
				this.StatusCode.ToString(),
				JsonConvert.SerializeObject(this.Content));
        }
    }
}