using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebCommons.IO;

namespace WebCommons.Controllers
{
    public static partial class ControllerResponseExtensions
    {

        public static FileResult AsFile(this HttpResponse response, SystemFile file)
        {
            FileStream stream = file.ReadAsStream();
            response.StatusCode = 200;
            return new FileStreamResult(stream, file.ContentType);
        }

        public static FileResult AsFile(this HttpResponse response, FileStream stream, FileType fileType)
        {
            response.StatusCode = 200;
            return new FileStreamResult(stream, FileTypeMap.GetContentType(fileType));
        }

        public static FileResult AsFile(this HttpResponse response, MemoryStream stream, FileType fileType)
        {
            response.StatusCode = 200;
            return new FileStreamResult(stream, FileTypeMap.GetContentType(fileType));
        }

        public static FileResult? AsFile(this HttpResponse response, Exception ex)
        {
            response.StatusCode = 404;
            return default;
        }
    }
}
