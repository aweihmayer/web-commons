using System.Net;

namespace WebCommons
{
    public class GoneException : ResponseException
    {
        public GoneException(string? message = null) : base(HttpStatusCode.Gone, message) { }
    }
}