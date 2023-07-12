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
        /// Defines the default values for all requests.
        /// </summary>
        public ApiRequest Defaults { get; set; } = new ApiRequest();

        protected Api(HttpClient client)
        {
            this.Client = client;
        }

        /// <summary>
        /// Sends a request and returns a response.
        /// </summary>
        public async Task<ApiResponse<T>> SendRequest<T>(ApiRequest request)
        {
            using HttpClient client = new();
            Stopwatch watch = new();
            watch.Start();
            try
            {
                // Build
                HttpRequestMessage requestMessage = request.Build();
                // Send
                HttpResponseMessage response = await client.SendAsync(requestMessage).ConfigureAwait(false);
                // Read
                string content = await response.Content.ReadAsStringAsync();
                watch.Stop();
                var parsedResponse = new ApiResponse<T>(response, content, watch.Elapsed);

                if (!parsedResponse.IsSuccessStatusCode) { throw parsedResponse.ToException(); }
                return parsedResponse;
            }
            catch (Exception)
            {
                watch.Stop();
                return new ApiResponse<T>(HttpStatusCode.InternalServerError);
            }
        }

        /// <summary>
        /// Sends a request and returns a response.
        /// </summary>
        public async Task<ApiResponse<T>> SendRequest<T>(string endpoint, HttpMethod method, object? query = null, object? model = null)
        {
            ApiRequest request = new(endpoint, method)
            {
                Api = this,
                Query = query,
                Model = model
            };

            return await this.SendRequest<T>(request);
        }
    }
}