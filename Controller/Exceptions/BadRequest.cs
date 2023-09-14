using System.Net;

namespace WebCommons
{
    public class BadRequestException : ResponseException
    {
        public BadRequestException(string? message = null) : base(HttpStatusCode.BadRequest, message) { }
    }
}