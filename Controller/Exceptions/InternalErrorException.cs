using System.Net;

namespace WebCommons
{
    public class InternalErrorException : ResponseException
    {
        public InternalErrorException(string? message = null) : base(HttpStatusCode.InternalServerError, message) { }
    }
}