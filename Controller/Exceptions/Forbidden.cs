using System.Net;

namespace WebCommons
{
    public class ForbiddenException : ResponseException
    {
        public ForbiddenException(string? message = null) : base(HttpStatusCode.Forbidden, message) { }
    }
}