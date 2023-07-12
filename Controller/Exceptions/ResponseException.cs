using System.Net;

namespace WebCommons
{
    public class ResponseException : Exception
    {
        public HttpStatusCode StatusCode { get; set; }

        public ResponseException(HttpStatusCode statusCode, string? message = null) : base(message) {
            this.StatusCode = statusCode; 
        }
    }
}