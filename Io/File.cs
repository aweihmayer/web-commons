using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace WebCommons.IO
{
    /// <summary>
    /// Defines a file on the system's drive.
    /// </summary>
    public class SystemFile
    {
        public static string Root { get; set; }
        public string Path { get; }
        public FileType FileType { get; }
        public string Extension { get { return FileTypeMap.GetExtension(this.FileType); } }
        public string ContentType { get { return FileTypeMap.GetContentType(this.FileType); } }

        public SystemFile(string path)
        {
            this.Path = MapPath(path);
            string[] parts = this.Path.Split('.');
            this.FileType = FileTypeMap.GetFileType(parts[parts.Length - 1]);
        }

        public SystemFile(string path, FileType type)
        {
            this.Path = MapPath(path);
            this.FileType = type;
            string[] parts = this.Path.Split('.');
            if (parts.Length == 1) {
                this.Path += "." + FileTypeMap.GetExtension(type);
            }
        }

        /// <summary>
        /// Appends the file path to the root path.
        /// </summary>
        public static string MapPath(string file)
        {
            return Root + file;
        }

        /// <summary>
        /// Copies the file to another location.
        /// </summary>
        public void Copy(SystemFile destination) => File.Copy(this.Path, destination.Path);

        /// <summary>
        /// Deletes the file.
        /// </summary>
        public void Delete()
        {
            try {
                File.Delete(this.Path);
            } catch (Exception) { }
        }

        /// <summary>
        /// Determines if the file exists.
        /// </summary>
        public bool Exists() => File.Exists(this.Path);

        #region Read

        /// <summary>
        /// Reads the file as plain text.
        /// </summary>
        public string? Read() => File.ReadAllText(this.Path);

        /// <summary>
        /// Reads the file as JSON and deserializes the contents into an object.
        /// </summary>
        /// <typeparam name="T">The type that the file contents will be deserialized to.</typeparam>
        public T? Read<T>() => JsonConvert.DeserializeObject<T>(this.Read());

        /// <summary>
        /// Creates a stream of the file.
        /// </summary>
        public FileStream ReadAsStream() => new (this.Path, FileMode.Open, FileAccess.Read);

        #endregion

        #region Write

        /// <summary>
        /// Writes contents into the file.
        /// If the file exists it is overwritten, otherwise it is created.
        /// </summary>
        public void Write(string contents) => File.WriteAllText(this.Path, contents);

        /// <summary>
        /// Serializes an object and writes the contents into the file.
        /// If the file exists it is overwritten, otherwise it is created.
        /// </summary>
        public void Write(object contents) => this.Write(JsonConvert.SerializeObject(contents));

        #endregion

        /// <summary>
        /// Gets all files matching a specified pattern in a directory and its subdirectories.
        /// </summary>
        /// <param name="directory">The directory to retrieve files from.</param>
        /// <param name="pattern">The patten files must match to be retrieved.</param>
        /// <returns>A list of file objects.</returns>
        public static List<SystemFile> GetAllFilesInDirectory(string directory, string pattern)
        {
            List<SystemFile> files = new();
            
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