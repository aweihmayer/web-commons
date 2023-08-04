using System.Diagnostics;
using System.Net;

namespace WebCommons.Api
{
    /// <summary>
    /// Defines the standard way to create an API request collection.
    /// <see cref="ApiRequestCollection{T}">Collections</see> are available to further organize requests.
    /// </summary>
    public abstract class Api
    {
        public HttpClient Client { get; set; }

        /// <summary>
        /// Defines the default query for all requests <see cref="ApiRequest.Query"/>.
        /// </summary>
        public object? DefaultQuery { get; set; }

        /// <summary>
        /// Defines the default model for all requests <see cref="ApiRequest.Model"/>.
        /// </summary>
        public object? DefaultModel { get; set; }

        protected Api() : this(new HttpClient()) { }

        protected Api(HttpClient client)
        {
            this.Client = client;
        }

        /// <summary>
        /// Sends a request and returns a response.
        /// </summary>
        public async Task<ApiResponse<T>> SendRequest<T>(ApiRequest request)
        {
            Stopwatch watch = new();
            watch.Start();
            try {
                HttpRequestMessage requestMessage = request.Build();
                HttpResponseMessage response = await this.Client.SendAsync(requestMessage).ConfigureAwait(false);
                string content = await response.Content.ReadAsStringAsync();
                watch.Stop();
                var parsedResponse = new ApiResponse<T>(response, content, watch.Elapsed);
                if (!parsedResponse.IsSuccessStatusCode) { throw parsedResponse.ToException(); }
                return parsedResponse;
            } catch (Exception) {
                watch.Stop();
                return new ApiResponse<T>(HttpStatusCode.InternalServerError);
            }
        }

        /// <summary>
        /// Sends a request and returns a response.
        /// </summary>
        public async Task<ApiResponse<T>> SendRequest<T>(string endpoint, HttpMethod method, object? query = null, object? model = null)
        {
            ApiRequest request = new(endpoint, method, query, model, this.DefaultQuery, this.DefaultModel);
            return await this.SendRequest<T>(request);
        }
    }
}