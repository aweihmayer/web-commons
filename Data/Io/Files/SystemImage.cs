using System.Drawing;
using System.Drawing.Imaging;

namespace WebCommons.IO
{
    /// <summary>
    /// Defines an image file on the system's drive.
    /// </summary>
    public class SystemImageFile : SystemFile
    {
        public SystemImageFile(string path) : base(path) { }

        /// <summary>
        /// Reads the image file as an image object.
        /// </summary>
        public Image ReadImage() => Image.FromFile(this.Path);

        /// <summary>
        /// Reads the image file as a base64 string.
        /// </summary>
        public string ReadBase64()
        {
            MemoryStream ms = new();
            Image img = this.ReadImage();
            img.Save(ms, img.RawFormat);
            byte[] imageBytes = ms.ToArray();
            return Convert.ToBase64String(imageBytes);
        }

        /// <summary>
        /// Writes to the image file using a base64 value.
        /// </summary>
        public void WriteBase64(string base64)
        {
            base64 = base64.Substring(base64.IndexOf(',') + 1);
            byte[] bytes = Convert.FromBase64String(base64);
            using MemoryStream ms = new(bytes, false);
            using (var image = Image.FromStream(ms, useEmbeddedColorManagement: true, validateImageData: false)) {
                image.Save(this.Path, ImageFormat.Jpeg);
            }
        }
    }
}