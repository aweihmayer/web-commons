using System.Text;
using System.Xml;

namespace WebCommons.Sitemap
{
    /// <summary>
    /// Defines an XML sitemap.
    /// A sitemap is a list of pages of a website.
    /// Sitemaps are intended for web crawlers such as search engines to better index your website.
    /// <see href="https://www.sitemaps.org/protocol.html" />
    /// </summary>
    public class Sitemap : XmlDocument
    {
        protected string Host { get; set; }
        protected enum ChangeFrequency { Always, Hourly, Daily, Weekly, Monthly, Yearly, Never }
        protected XmlElement UrlSet;

        /// <param name="host">The base URL protocol and domain (ex: https://www.google.com).</param>
        public Sitemap(string host)
        {
            this.Host = host;

            // Create document and its root
            XmlNode declaration = this.CreateXmlDeclaration("1.0", "UTF-8", null);
            XmlElement root = this.DocumentElement;
            this.InsertBefore(declaration, root);

            // Create urlset node
            this.UrlSet = this.CreateElement("urlset");
            this.UrlSet.SetAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");
            this.AppendChild(this.UrlSet);
        }

        /// <summary>
        /// Adds a URL to the sitemap.
        /// </summary>
        /// <param name="loc">The relative URL path (ex: /articles/new-president-elected).</param>
        /// <param name="lastmod">The last modified date. If it is not specified, it will be the current date.</param>
        /// <param name="changefreq">The change frequency.</param>
        /// <param name="priority">The priority from 0.0 to 1.0.</param>
        protected void AddUrl(string loc, DateOnly? lastmod = null, ChangeFrequency changefreq = ChangeFrequency.Yearly, double priority = 0.5)
        {
            XmlElement urlEl = this.CreateElement("url");

            // Location
            XmlElement locEl = this.CreateElement("loc");
            locEl.InnerText = this.Host + loc;
            urlEl.AppendChild(locEl);

            // Last modification
            XmlElement lastmodEl = this.CreateElement("lastmod");
            lastmod = (lastmod == null) ? DateTime.UtcNow.ToDateOnly() : lastmod;
            lastmodEl.InnerText = lastmod.Value.ToString("yyyy-MM-dd");
            urlEl.AppendChild(lastmodEl);

            // Change frequency
            XmlElement changefreqEl = this.CreateElement("changefreq");
            changefreqEl.InnerText = Enum.GetName(typeof(ChangeFrequency), changefreq).ToLower();
            urlEl.AppendChild(changefreqEl);

            // Priority
            if (priority > 1 || priority < 0) priority = 0.5;
            XmlElement priorityEl = this.CreateElement("priority");
            priorityEl.InnerText = priority.ToString("0.#");
            urlEl.AppendChild(priorityEl);
            
            this.UrlSet.AppendChild(urlEl);
        }

        /// <summary>
        /// Gets the memory stream of the XML.
        /// </summary>
        public MemoryStream ToMemoryStream() => new(Encoding.UTF8.GetBytes(this.InnerXml));
    }
}