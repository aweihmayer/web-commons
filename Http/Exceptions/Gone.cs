using System.Net;

namespace WebCommons.Http
{
    public class GoneException : ResponseException
    {
        public GoneException(string? message = null) : base(HttpStatusCode.Gone, message) { }
    }
}