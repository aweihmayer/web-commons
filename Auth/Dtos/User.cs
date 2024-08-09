using Newtonsoft.Json;
using WebCommons.Db;

namespace WebCommons.Dto
{
    public abstract class CommonUserDto : ITimestampableDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("email", NullValueHandling = NullValueHandling.Ignore)]
        public string? Email { get; set; }

        [JsonProperty("username", NullValueHandling = NullValueHandling.Ignore)]
        public string? Username { get; set; }

        [JsonProperty("createdDate", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? CreatedDate { get; set; }

        [JsonProperty("updatedDate", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? UpdatedDate { get; set; }

        [JsonProperty("tokens", NullValueHandling = NullValueHandling.Ignore)]
        public List<UserTokenDto>? Tokens { get; set; }

        public UserTokenDto? AccessToken { get {
            if (this.Tokens == null) return null;
            else return this.Tokens.FirstOrDefault(t => t.Type == UserTokenType.Access.ToString().ToLower());
        }}

        public UserTokenDto? RefreshToken { get {
            if (this.Tokens == null) return null;
            else return this.Tokens.FirstOrDefault(t => t.Type == UserTokenType.Refresh.ToString().ToLower());
        }}

        [JsonProperty("password", NullValueHandling = NullValueHandling.Ignore)]
        public string? Password { get; set; }

        [JsonProperty("salt", NullValueHandling = NullValueHandling.Ignore)]
        public string? Salt { get; set; }

        public CommonUserDto() { }
    }
}