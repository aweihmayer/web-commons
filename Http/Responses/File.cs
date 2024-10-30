using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebCommons.IO;

namespace WebCommons.Controllers
{
    /// <summary>
    /// Defines how a controller returns a file response.
    /// </summary>
    public static partial class ControllerResponseExtensions
    {
        public static FileResult AsFile(this HttpResponse response, SystemFile file)
        {
            FileStream stream = file.ReadAsStream();
            response.StatusCode = 200;
            return new FileStreamResult(stream, file.ContentType);
        }

        public static FileResult AsFile(this HttpResponse response, FileStream stream, string extension)
        {
            response.StatusCode = 200;
            return new FileStreamResult(stream, FileType.GetContentType(extension));
        }

        public static FileResult AsFile(this HttpResponse response, MemoryStream stream, string extension)
        {
            response.StatusCode = 200;
            return new FileStreamResult(stream, FileType.GetContentType(extension));
        }

        public static FileResult? AsFile(this HttpResponse response, Exception ex, string extension)
        {
            response.StatusCode = 404;
            return new FileStreamResult(FileStream.Null, FileType.GetContentType(extension));
        }
    }
}
