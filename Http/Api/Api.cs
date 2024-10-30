using System.stics;
using System.Net;

namespace WebCommons.Api
{
    /// <summary>
    /// Defines the standard way to create an API request collection.
    /// <see cref="ApiRequestCollection{T}">Collections</see> are available to organize requests.
    /// </summary>
    public abstract class Api : IDisposable
    {
        public HttpClient Client { get; set; }

        /// <summary>
        /// Defines the default model for all requests <see cref="ApiRequest.Model"/>.
        /// </summary>
        public object? DefaultModel { get; set; }

        protected Api() : this(new HttpClient()) { }

        protected Api(HttpClient client) { this.Client = client; }

        /// <summary>
        /// Sends a request and returns a response.
        /// </summary>
        public async Task<HttpResponse<T>> SendRequest<T>(HttpRequest request)
        {
            Stopwatch watch = new();
            watch.Start();
            try {
                Httest.Build();
                HttpResponseMessage response = await this.Client.SendAsync(requestMessage).ConfigureAwait(false);
                string content = await response.Content.ReadAsStringAsync();
                watch.Stop();
                var parsedResponse = new HttpResponse<T>(response, content, watch.Elapsed);
                if (!parsedResponse.IsSuccessStatusCode) throw parsedResponse.ToException();
                return parsedResponse;
            } catch (ResponseException ex) {
                return new HttpResponse<T>(ex);
            } catch (Exception) {
                watch.Stop();
                return new HttpResponse<T>(HttpStatusCode.InternalServerError);
            }
        }

        /// <summary>
        /// Override this method to modify a request before it is sent.
        /// </summary>
        public virtual void PrepareRequest(HttpRequest request)
        {

        }

        public void Dispose()
        {
            if (this.Client != null) this.Client.Dispose();
        }
    }
}