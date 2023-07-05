using WebCommons.Api;

namespace WebCommons.Api
{
    /// <summary>
    /// Organizes the requests of an API.
    /// Has a reference of the main API.
    /// </summary>
    /// <typeparam name="T">The API parent class type.</typeparam>
    public abstract class ApiRequestCollection<TApi> where TApi : Api
    {
        protected TApi Api { get; set; }

        protected ApiRequestCollection(TApi api)
        {
            this.Api = api;
        }

        /// <summary>
        /// Sends a request and returns a response.
        /// </summary>
        protected async Task<ApiResponse<T>> SendRequest<T>(ApiRequest request)
        {
            return await this.Api.SendRequest<T>(request);
        }

        /// <summary>
        /// Sends a request and returns a response.
        /// </summary>
        protected async Task<ApiResponse<T>> SendRequest<T>(string endpoint, HttpMethod method, object? query = null, object? model = null)
        {
            return await this.Api.SendRequest<T>(endpoint, method, query, model);
        }
    }
}