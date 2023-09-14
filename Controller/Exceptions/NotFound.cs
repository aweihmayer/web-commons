using System.Net;

namespace WebCommons
{
    public class NotFoundException : ResponseException
    {
        public NotFoundException(string? message = null) : base(HttpStatusCode.NotFound, message) { }
    }
}