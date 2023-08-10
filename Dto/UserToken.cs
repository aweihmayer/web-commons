using Newtonsoft.Json;
using WebCommons.Db;

namespace WebCommons.Dto
{
    public class UserTokenDto : CommonDto
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("code")]
        public int? Code { get; set; }

        [JsonProperty("formattedCode", NullValueHandling = NullValueHandling.Ignore)]
        public string? FormattedCode { get; set; }

        [JsonProperty("duration")]
        public TimeSpan? Duration { get; set; }

        [JsonProperty("expirateDate")]
        public DateTime? ExpiryDate { get; set; }

        [JsonProperty("type")]
        public UserTokenType Type { get; set; }

        [JsonProperty("userId")]
        public int? UserId { get; set; }

        public UserTokenDto(UserToken<CommonUser> token)
        {
            this.Id = token.Id;
            this.Code = token.Code;
            this.FormattedCode = token.FormattedCode;
            this.Duration = token.Duration;
            this.ExpiryDate = token.ExpiryDate;
            this.Type = token.Type;
            this.UserId = token.UserId;
            this.System = new SystemDto(token);
        }
    }
}
