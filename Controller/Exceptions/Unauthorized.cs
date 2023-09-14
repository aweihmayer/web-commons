using System.Net;

namespace WebCommons
{
    public class UnauthorizedException : ResponseException
    {
        public UnauthorizedException(string? message = null) : base(HttpStatusCode.Unauthorized, message) { }
    }
}