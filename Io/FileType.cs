namespace WebCommons.IO
{
    public enum FileType
    {
        CSS, GIF, HTML, ICO, JPG, JS, JSON, PNG, TTF, WOFF, XML, Unknown
    }

    public static class FileTypeMap
    {
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

        public static string GetExtension(FileType type)
        {
            switch (type) {
                case FileType.CSS:  return CSS;
                case FileType.GIF:  return GIF;
                case FileType.HTML: return HTML;
                case FileType.ICO:  return ICO;
                case FileType.JPG:  return JPG;
                case FileType.JS:   return JS;
                case FileType.JSON: return JSON;
                case FileType.PNG:  return PNG;
                case FileType.TTF:  return TTF;
                case FileType.WOFF: return WOFF;
                case FileType.XML:  return XML;
                default:            return string.Empty;
            }
        }

        public static FileType GetFileType(string extension)
        {
            switch (extension.ToLower()) {
                case CSS:   return FileType.CSS;
                case GIF:   return FileType.GIF;
                case HTML:  return FileType.HTML;
                case ICO:   return FileType.ICO;
                case JPG:   return FileType.JPG;
                case JS:    return FileType.JS;
                case JSON:  return FileType.JSON;
                case PNG:   return FileType.PNG;
                case TTF:   return FileType.TTF;
                case WOFF:  return FileType.WOFF;
                case XML:   return FileType.XML;
                default:    return FileType.Unknown;
            }
        }

        /// <summary>
        /// Gets the content type value for HTTP headers.
        /// </summary>
        public static string GetContentType(FileType type)
        {
            switch (type) {
                case FileType.CSS:  return CSS_CONTENT_TYPE;
                case FileType.GIF:  return GIF_CONTENT_TYPE;
                case FileType.HTML: return HTML_CONTENT_TYPE;
                case FileType.ICO:  return ICO_CONTENT_TYPE;
                case FileType.JPG:  return JPG_CONTENT_TYPE;
                case FileType.JS:   return JS_CONTENT_TYPE;
                case FileType.JSON: return JSON_CONTENT_TYPE;
                case FileType.PNG:  return PNG_CONTENT_TYPE;
                case FileType.TTF:  return TTF_CONTENT_TYPE;
                case FileType.WOFF: return WOFF_CONTENT_TYPE;
                case FileType.XML:  return XML_CONTENT_TYPE;
                default:            return string.Empty;
            }
        }

        /// <summary>
        /// Gets the content type value for HTTP headers.
        /// </summary>
        public static string GetContentType(string extension)
        {
            return GetContentType(GetFileType(extension));
        }
    }
}
