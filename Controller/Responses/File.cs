using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebCommons.IO;

namespace WebCommons.Controllers
{
    public static partial class ControllerResponseExtensions
    {

        public static FileResult AsFile(this HttpResponse response, SystemFile file)
        {
            using FileStream stream = file.ReadAsStream();
            response.StatusCode = 200;
            return new FileStreamResult(stream, file.ContentType);
        }

        public static FileResult? AsFile(this HttpResponse response, Exception ex)
        {
            response.StatusCode = 404;
            return default;
        }
    }
}
