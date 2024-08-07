﻿namespace WebCommons.IO
{
    /// <summary>
    /// Defines file types and their different formats.
    /// </summary>
    public static class FileType
    {
        public enum Type { Css, Gif, Html, Ico, Jpg, Png, Js, Json, Ttf, Woff, Xml };

        public const string CSS = "css";
        public const string CSS_CONTENT_TYPE = "text/css";

        public const string GIF = "gif";
        public const string GIF_CONTENT_TYPE = "image/gif";

        public const string HTML = "html";
        public const string HTML_CONTENT_TYPE = "text/html";

        public const string ICO = "ico";
        public const string ICO_CONTENT_TYPE = "image/x-icon";

        public const string JPG = "jpg";
        public const string JPG_CONTENT_TYPE = "image/jpeg";

        public const string JS = "js";
        public const string JS_CONTENT_TYPE = "text/javascript";

        public const string JSON = "json";
        public const string JSON_CONTENT_TYPE = "application/json";

        public const string PNG = "png";
        public const string PNG_CONTENT_TYPE = "image/png";

        public const string TTF = "ttf";
        public const string TTF_CONTENT_TYPE = "application/x-font-ttf";

        public const string WOFF = "woff";
        public const string WOFF_CONTENT_TYPE = "application/x-font-woff";

        public const string XML = "xml";
        public const string XML_CONTENT_TYPE = "text/xml";

        /// <summary>
        /// Gets the file extension format (.jpg) for a content type format (image/jpeg).
        /// </summary>
        public static string GetExtension(Type type)
        {
            switch (type) {
                case Type.Css:  return CSS;
                case Type.Gif:  return GIF;
                case Type.Html: return HTML;
                case Type.Ico:  return ICO;
                case Type.Jpg:  return JPG;
                case Type.Js:   return JS;
                case Type.Json: return JSON;
                case Type.Png:  return PNG;
                case Type.Ttf:  return TTF;
                case Type.Woff: return WOFF;
                case Type.Xml:  return XML;
                default:        return string.Empty;
            }
        }

        /// <summary>
        /// Gets the file extension format (.jpg) for a content type format (image/jpeg).
        /// </summary>
        public static string GetExtension(string contentType)
        {
            switch (contentType) {
                case CSS_CONTENT_TYPE:  return CSS;
                case GIF_CONTENT_TYPE:  return GIF;
                case HTML_CONTENT_TYPE: return HTML;
                case ICO_CONTENT_TYPE:  return ICO;
                case JPG_CONTENT_TYPE:  return JPG;
                case JS_CONTENT_TYPE:   return JS;
                case JSON_CONTENT_TYPE: return JSON;
                case PNG_CONTENT_TYPE:  return PNG;
                case TTF_CONTENT_TYPE:  return TTF;
                case WOFF_CONTENT_TYPE: return WOFF;
                case XML_CONTENT_TYPE:  return XML;
                default:                return contentType;
            }
        }

        /// <summary>
        /// Gets the content type format (image/jpeg) for a file extension format (.jpg).
        /// </summary>
        public static string GetContentType(string extension)
        {
            switch (extension) {
                case CSS:   return CSS_CONTENT_TYPE;
                case GIF:   return GIF_CONTENT_TYPE;
                case HTML:  return HTML_CONTENT_TYPE;
                case ICO:   return ICO_CONTENT_TYPE;
                case JPG:   return JPG_CONTENT_TYPE;
                case JS:    return JS_CONTENT_TYPE;
                case JSON:  return JSON_CONTENT_TYPE;
                case PNG:   return PNG_CONTENT_TYPE;
                case TTF:   return TTF_CONTENT_TYPE;
                case WOFF:  return WOFF_CONTENT_TYPE;
                case XML:   return XML_CONTENT_TYPE;
                default:    return extension;
            }
        }
    }
}