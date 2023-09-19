using Newtonsoft.Json;
using WebCommons.Db;

namespace WebCommons.Dto
{
    public class UserTokenDto : CommonDto
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("code", NullValueHandling = NullValueHandling.Ignore)]
        public int? Code { get; set; }

        [JsonProperty("formattedCode", NullValueHandling = NullValueHandling.Ignore)]
        public string? FormattedCode { get; set; }

        [JsonProperty("duration")]
        public TimeSpan? Duration { get; set; }

        [JsonProperty("expirationDate")]
        public DateTime? ExpirationDate { get; set; }

        [JsonProperty("type")]
        public UserTokenType Type { get; set; }

        public UserTokenDto(IUserToken token)
        {
            this.Id = token.Id;
            this.Code = token.Code;
            this.FormattedCode = token.FormattedCode;
            this.Duration = token.Duration;
            this.ExpirationDate = token.ExpirationDate;
            this.Type = token.Type;
        }
    }
}
