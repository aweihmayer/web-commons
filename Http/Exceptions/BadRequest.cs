using System.Net;

namespace WebCommons.Http
{
    public class BadRequestException : ResponseException
    {
        public BadRequestException(string? message = null) : base(HttpStatusCode.BadRequest, message) { }
    }
}