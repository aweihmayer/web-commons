using System.Net;

namespace WebCommons
{
    public class ConflictException : ResponseException
    {
        public ConflictException(string? message = null) : base(HttpStatusCode.Conflict, message) { }
    }
}