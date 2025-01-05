using System.Net;

namespace WebCommons.Http
{
    public class NotFoundException : ResponseException
    {
        public NotFoundException(string? message = null) : base(HttpStatusCode.NotFound, message) { }
    }
}