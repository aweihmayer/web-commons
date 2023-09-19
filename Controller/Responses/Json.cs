using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using WebCommons.IO;

namespace WebCommons.Controllers
{
    public static partial class ControllerResponseExtensions
    {
        #region Main

        public static ContentResult AsJson(this HttpResponse response, string content, int code = 200)
        {
            response.StatusCode = code;
            return new ContentResult { Content = content, ContentType = FileType.JSON_CONTENT_TYPE };
        }

        public static ContentResult AsJson(this HttpResponse response, object content, int code = 200)
        {
            return response.AsJson(JsonConvert.SerializeObject(content), code);
        }

        public static ContentResult AsJson(this HttpResponse response, int code = 200)
        {
            return response.AsJson("{}", code);
        }

        public static ContentResult AsJson(this HttpResponse response, string content, HttpStatusCode code)
        {
            return response.AsJson(content, (int)code);
        }

        public static ContentResult AsJson(this HttpResponse response, object content, HttpStatusCode code)
        {
            return response.AsJson(content, (int)code);
        }

        public static ContentResult AsJson(this HttpResponse response, HttpStatusCode code)
        {
            return response.AsJson((int)code);
        }

        #endregion

        #region Error

        public static ContentResult AsJson(this HttpResponse response, Exception ex)
        {
            return response.AsJson(HttpStatusCode.InternalServerError);
        }

        public static ContentResult AsJson(this HttpResponse response, ResponseException ex)
        {
            return (ex.HasDefaultMessage)
                ? response.AsJson("{}", ex.StatusCode)
                : response.AsJson(new { message = ex.Message }, ex.StatusCode);
        }

        #endregion
    }
}
