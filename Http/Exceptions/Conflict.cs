using System.Net;

namespace WebCommons.Http
{
    public class ConflictException : ResponseException
    {
        public ConflictException(string? message = null) : base(HttpStatusCode.Conflict, message) { }
    }
}