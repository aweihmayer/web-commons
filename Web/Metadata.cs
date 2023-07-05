namespace WebCommons.Web
{
    /// <summary>
    /// Defines the HTML page metadata for search engines.
    /// </summary>
    public class SearchEngineMetadata
    {
        public string Title { get; set; } = null;
        public string TitlePrefix { get; set; } = null;
        public string TitleSuffix { get; set; } = null;
        public string FullTitle { get {
                return (this.TitlePrefix + " " + this.Title + " " + this.TitleSuffix).Trim();
            } }

        public string Section { get; set; } = null;
        public string Description { get; set; } = null;
        public string Image { get; set; } = null;
        public string SiteName { get; set; } = null;
        public string Domain { get; set; } = null;
        public string Url { get; set; } = null;
        public string Locale { get; set; } = null;
        public DateTime? ModifiedTime { get; set; } = null;
        public RobotIndexing Robots { get; set; } = RobotIndexing.Follow;
        public enum RobotIndexing { Follow, NoFollow }
        private static readonly Dictionary<RobotIndexing, string> RobotsMap = new Dictionary<RobotIndexing, string>() {
            { RobotIndexing.Follow, "index, follow" },
            { RobotIndexing.NoFollow, "noindex, nofollow" } };
        public PageType Type { get; set; } = PageType.Website;
        public enum PageType { Article, Profile, Website, Other }
        public string Html
        {
            get
            {
                string html = "<title>" + this.FullTitle + "</title>";
                html += this.createMetadataElement("og:title", "property", this.FullTitle);
                html += this.createMetadataElement("description", "name", this.Description);
                html += this.createMetadataElement("og:description", "property", this.Description);
                html += this.createMetadataElement("og:type", "property", (this.Type == PageType.Other) ? null : Enum.GetName(typeof(PageType), this.Type).ToLower());
                html += this.createMetadataElement("og:section", "property", this.Section);
                html += this.createMetadataElement("og:site_name", "property", this.SiteName);
                html += this.createMetadataElement("og:locale", "property", this.Locale);
                html += this.createMetadataElement("og:modified_time", "property", (this.ModifiedTime == null) ? null : this.ModifiedTime.Value.ToString("yyyy-MM-dd"));
                html += this.createMetadataElement("og:image", "property", this.Domain + this.Image);
                html += this.createMetadataElement("robots", "name", RobotsMap[this.Robots]);
                html += this.createMetadataElement("url", "name", this.Domain + this.Url);
                return html;
            }
        }

        private string createMetadataElement(string name, string attribute, string value)
        {
            if (string.IsNullOrEmpty(value)) { return ""; }
            return "<meta " + attribute + "=\"" + name + "\" content=\"" + value + "\" />";
        }
    }
}