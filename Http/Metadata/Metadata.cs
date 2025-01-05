using System.Collections.Generic;

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

        public Dictionary<string, string> ToMap()
        {
            Dictionary<string, string> map = new();
            map["title"] = this.Title;
            map["fullTitle"] = this.FullTitle;
            map["titlePrefix"] = this.TitlePrefix;
            map["titleSuffix"] = this.TitleSuffix;
            map["description"] = this.Description;
            map["type"] = (this.Type == PageType.Other) ? null : Enum.GetName(typeof(PageType), this.Type).ToLower();
            map["section"] = this.Section;
            map["siteName"] = this.SiteName;
            map["locale"] = this.Locale;
            map["modifiedTime"] = this.ModifiedTime?.ToString("yyyy-MM-dd");
            map["image"] = this.Domain + this.Image;
            map["robots"] = RobotsMap[this.Robots];
            map["url"] = this.Domain + this.Url;
            return map;
        }

        public string ToHtml()
        {
            var map = this.ToMap();
            return "<title>" + this.FullTitle + "</title>"
                + CreateMetadataElement("og:title", "property", this.FullTitle)
                + CreateMetadataElement("description", "name", map["description"])
                + CreateMetadataElement("og:description", "property", map["description"])
                + CreateMetadataElement("og:type", "property", map["type"])
                + CreateMetadataElement("og:section", "property", map["section"])
                + CreateMetadataElement("og:site_name", "property", map["siteName"])
                + CreateMetadataElement("og:locale", "property", map["locale"])
                + CreateMetadataElement("og:modified_time", "property", map["modifiedTime"])
                + CreateMetadataElement("og:image", "property", map["image"])
                + CreateMetadataElement("robots", "name", map["robots"])
                + CreateMetadataElement("url", "name", map["url"]);
        }

        private static string CreateMetadataElement(string name, string attribute, string value)
        {
            if (string.IsNullOrEmpty(value)) return string.Empty;
            else return string.Format("<meta {0}=\"{1}\" content=\"{2}\" />", attribute, name, value);
        }
    }
}