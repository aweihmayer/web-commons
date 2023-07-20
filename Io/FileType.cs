namespace WebCommons.IO
{
    public enum FileType
    {
        HTML, XML,
        JS, CSS,
        JPG, PNG, GIF, ICO,
        TTF, WOFF,
        Unknown
    }

    public static class FileTypeMap
    {
        public static string GetExtension(FileType type)
        {
            switch (type) {
                case FileType.HTML: return "html";
                case FileType.XML:  return "xml";
                case FileType.JS:   return "js";
                case FileType.CSS:  return "css";
                case FileType.JPG:  return "jpg";
                case FileType.PNG:  return "png";
                case FileType.GIF:  return "gif";
                case FileType.ICO:  return "ico";
                case FileType.TTF:  return "ttf";
                case FileType.WOFF: return "woff";
                default:            return string.Empty;
            }
        }

        public static FileType GetFileType(string extension)
        {
            switch (extension.ToLower()) {
                case "html":    return FileType.HTML;
                case "xml":     return FileType.XML;
                case "js":      return FileType.JS;
                case "css":     return FileType.CSS;
                case "jpg":     return FileType.JPG;
                case "png":     return FileType.PNG;
                case "gif":     return FileType.GIF;
                case "ico":     return FileType.ICO;
                case "ttf":     return FileType.TTF;
                case "woff":    return FileType.WOFF;
                default:        return FileType.Unknown;
            }
        }

        public static string GetContentType(FileType type)
        {
            switch (type) {
                case FileType.HTML: return "text/html";
                case FileType.XML:  return "text/xml";
                case FileType.JS:   return "text/javascript";
                case FileType.CSS:  return "text/css";
                case FileType.JPG:  return "image/jpeg";
                case FileType.PNG:  return "image/png";
                case FileType.GIF:  return "image/gif";
                case FileType.ICO:  return "image/x-icon";
                case FileType.TTF:  return "application/x-font-ttf";
                case FileType.WOFF: return "application/x-font-woff";
                default:            return string.Empty;
            }
        }

        public static string GetContentType(string extension)
        {
            return GetContentType(GetFileType(extension));
        }
    }
}
