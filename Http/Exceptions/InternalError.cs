using System.Net;

namespace WebCommons.Http
{
    public class InternalErrorException : ResponseException
    {
        public InternalErrorException(string? message = null) : base(HttpStatusCode.InternalServerError, message) { }
    }
}