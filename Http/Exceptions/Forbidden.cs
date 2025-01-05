using System.Net;

namespace WebCommons.Http
{
    public class ForbiddenException : ResponseException
    {
        public ForbiddenException(string? message = null) : base(HttpStatusCode.Forbidden, message) { }
    }
}