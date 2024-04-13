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
        public string? Locale { get; set; } = "en_US";
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

        public string Html
        {
            get {
                return "<title>" + this.FullTitle + "</title>"
                    + CreateMetadataElement("og:title", "property", this.FullTitle)
                    + CreateMetadataElement("description", "name", this.Description)
                    + CreateMetadataElement("og:description", "property", this.Description)
                    + CreateMetadataElement("og:type", "property", (this.Type == PageType.Other) ? null : Enum.GetName(typeof(PageType), this.Type).ToLower())
                    + CreateMetadataElement("og:section", "property", this.Section)
                    + CreateMetadataElement("og:site_name", "property", this.SiteName)
                    + CreateMetadataElement("og:locale", "property", this.Locale)
                    + CreateMetadataElement("og:modified_time", "property", this.ModifiedTime?.ToString("yyyy-MM-dd"))
                    + CreateMetadataElement("og:image", "property", this.Domain + this.Image)
                    + CreateMetadataElement("robots", "name", RobotsMap[this.Robots])
                    + CreateMetadataElement("url", "name", this.Domain + this.Url);
            }
        }

        /// <summary>
        /// Creates the HTML element for the metadata value as a string.
        /// </summary>
        private static string CreateMetadataElement(string name, string attribute, string value)
        {
            if (string.IsNullOrEmpty(value)) return string.Empty;
            else return string.Format("<meta {0}=\"{1}\" content=\"{2}\" />", attribute, name, value);
        }
    }
}