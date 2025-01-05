using System.Net;

namespace WebCommons.Http
{
    public class LockedException : ResponseException
    {
        public LockedException(string? message = null) : base(HttpStatusCode.Locked, message) { }
    }
}