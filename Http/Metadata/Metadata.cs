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
        public string FullTitle { get => string.Format("{0}{1}{2}", this.TitlePrefix, this.Title, this.TitleSuffix).Trim(); }

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
            this.SiteName = siteName;
            this.Locale = locale;
            this.Title = title;
            this.TitlePrefix = titlePrefix;
            this.TitleSuffix = titleSuffix;
            this.Description = description;
            this.Image = image;
        }

        public string Html
        {
            get {
                return "<title>" + this.FullTitle + "</title>"
                    + createMetadataElement("og:title", "property", this.FullTitle)
                    + createMetadataElement("description", "name", this.Description)
                    + createMetadataElement("og:description", "property", this.Description)
                    + createMetadataElement("og:type", "property", this.Type == PageType.Other ? null : Enum.GetName(typeof(PageType), this.Type).ToLower())
                    + createMetadataElement("og:section", "property", this.Section)
                    + createMetadataElement("og:site_name", "property", this.SiteName)
                    + createMetadataElement("og:locale", "property", this.Locale)
                    + createMetadataElement("og:modified_time", "property", this.ModifiedTime == null ? null : this.ModifiedTime.Value.ToString("yyyy-MM-dd"))
                    + createMetadataElement("og:image", "property", this.Domain + this.Image)
                    + createMetadataElement("robots", "name", RobotsMap[this.Robots])
                    + createMetadataElement("url", "name", this.Domain + this.Url);
            }
        }

        private string createMetadataElement(string name, string attribute, string value)
        {
            if (string.IsNullOrEmpty(value)) return string.Empty;
            else return string.Format("<meta {0}=\"{1}\" content=\"{2}\" />", attribute, name, value);
        }
    }
}