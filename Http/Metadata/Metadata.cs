namespace WebCommons.Http
{
    /// <summary>
    /// Defines the HTML page metadata for search engines.
    /// </summary>
    public class SearchEngineMetadata
    {
        public string? Title { get; set; } = null;
        public string? TitlePrefix { get; set; } = null;
        public string? TitleSuffix { get; set; } = null;
        public string FullTitle {
            get {
                return (this.TitlePrefix + " " + this.Title + " " + this.TitleSuffix).Trim();
            }
        }

        public string? Section { get; set; } = null;
        public string? Description { get; set; } = null;
        public string? Image { get; set; } = null;
        public string? SiteName { get; set; } = null;
        public string? Domain { get; set; } = null;
        public string? Url { get; set; } = null;
        public string? Locale { get; set; } = null;
        public DateTime? ModifiedTime { get; set; } = null;
        public RobotIndexing Robots { get; set; } = RobotIndexing.Follow;
        public PageType Type { get; set; } = PageType.Website;

        #region Enums

        public enum RobotIndexing { Follow, NoFollow }
        private static readonly Dictionary<RobotIndexing, string> RobotsMap = new() {
            { RobotIndexing.Follow, "index, follow" },
            { RobotIndexing.NoFollow, "noindex, nofollow" } };

        public enum PageType { Article, Profile, Website, Other }

        #endregion

        public SearchEngineMetadata(string siteName, string locale, string? title = null, string? titlePrefix = null, string? titleSuffix = null, string? description = null, string? image = null)
        {
            SiteName = siteName;
            Locale = locale;
            TitlePrefix = titlePrefix;
            TitleSuffix = titleSuffix;
            Description = description;
            Image = image;
        }

        public string Html
        {
            get
            {
                string html = "<title>" + FullTitle + "</title>";
                html += createMetadataElement("og:title", "property", FullTitle);
                html += createMetadataElement("description", "name", Description);
                html += createMetadataElement("og:description", "property", Description);
                html += createMetadataElement("og:type", "property", Type == PageType.Other ? null : Enum.GetName(typeof(PageType), Type).ToLower());
                html += createMetadataElement("og:section", "property", Section);
                html += createMetadataElement("og:site_name", "property", SiteName);
                html += createMetadataElement("og:locale", "property", Locale);
                html += createMetadataElement("og:modified_time", "property", ModifiedTime == null ? null : ModifiedTime.Value.ToString("yyyy-MM-dd"));
                html += createMetadataElement("og:image", "property", Domain + Image);
                html += createMetadataElement("robots", "name", RobotsMap[Robots]);
                html += createMetadataElement("url", "name", Domain + Url);
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