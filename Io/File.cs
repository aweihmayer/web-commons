using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace WebCommons.IO
{
    /// <summary>
    /// Defines a file on the system's drive.
    /// </summary>
    public class SystemFile
    {
        /// <summary>
        /// Maps the file extension to its file stream type.
        /// </summary>
        protected static readonly Dictionary<string, string> EXTENSION_TYPE_MAP = new Dictionary<string, string>() {
            // Web
            { "js", "text/javascript" },
            { "css", "text/css" },
            // Images
            { "jpg", "image/jpeg" },
            { "png", "image/png" },
            { "ico", "image/x-icon" },
            // Fonts
            { "ttf", "application/x-font-ttf" },
            { "woff", "application/x-font-woff" } };

        public string Path { get; set; }
        public string Extension { get; set; }

        public SystemFile(string path) : this()
        {
            this.Path = MapPath(path);
            string[] parts = this.Path.Split('.');
            this.Extension = parts[parts.Length - 1];
        }

        public SystemFile() { }

        /// <summary>
        /// Appends the file path to the root path.
        /// </summary>
        public static string MapPath(string file)
        {
            return Host.WebRootPath + file;
        }

        private static IWebHostEnvironment host = null;
        private static IWebHostEnvironment Host { get {
            if (host != null) { return host; }
            HttpContextAccessor accessor = new HttpContextAccessor();
            if (accessor.HttpContext != null) {
                host = accessor.HttpContext.RequestServices.GetRequiredService<IWebHostEnvironment>();
            }
            return host;
        } }

        /// <summary>
        /// Determines if the file exists.
        /// </summary>
        public bool Exists()
        {
            return File.Exists(this.Path);
        }

        /// <summary>
        /// Reads the file as plain text.
        /// </summary>
        public string Read() => File.ReadAllText(this.Path);

        /// <summary>
        /// Reads the file as JSON and deserializes the contents into an object.
        /// </summary>
        /// <typeparam name="T">The type that the file contents will be deserialized to.</typeparam>
        public T Read<T>() => JsonConvert.DeserializeObject<T>(this.Read());

        /// <summary>
        /// Creates a stream of the file.
        /// </summary>
        public FileStreamResult ReadStreamResult()
        {
            FileStream fs = new FileStream(this.Path, FileMode.Open, FileAccess.Read);
            return new FileStreamResult(fs, EXTENSION_TYPE_MAP[this.Extension]);
        }

        /// <summary>
        /// Writes contents into the file.
        /// If the file exists it is overwritten, otherwise it is created.
        /// </summary>
        public void Write(string contents)
        {
            File.WriteAllText(this.Path, contents);
        }

        /// <summary>
        /// Serializes an object and writes the contents into the file.
        /// If the file exists it is overwritten, otherwise it is created.
        /// </summary>
        public void Write(object contents)
        {
            this.Write(JsonConvert.SerializeObject(contents));
        }

        /// <summary>
        /// Copies the file to another location.
        /// </summary>
        public void Copy(SystemFile destination)
        {
            File.Copy(this.Path, destination.Path);
        }

        /// <summary>
        /// Deletes the file.
        /// </summary>
        public void Delete()
        {
            File.Delete(this.Path);
        }

        /// <summary>
        /// Gets all files matching a specified pattern in a directory and its subdirectories.
        /// </summary>
        /// <param name="directory">The directory to retrieve files from.</param>
        /// <param name="pattern">The patten files must match to be retrieved.</param>
        /// <returns>A list of file objects.</returns>
        public static List<SystemFile> GetAllFilesInDirectory(string directory, string pattern)
        {
            List<SystemFile> files = new List<SystemFile>();
            
            string[] filePaths = Directory.GetFiles(
                MapPath(directory),
                pattern,
                SearchOption.AllDirectories);

            string file;
            foreach (string f in filePaths) {
                file = f.Replace(@"\", "/");
                file = file.Substring(file.IndexOf(directory));
                files.Add(new SystemFile(file));
            }

            return files;
        }
    }
}