using Newtonsoft.Json;
using WebCommons.Db;

namespace WebCommons.Dto
{
    public abstract class CommonUserDto : TimestampableDto
    {
        #region No details

        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("firstName")]
        public string? FirstName { get; set; }

        [JsonProperty("lastName")]
        public string? LastName { get; set; }

        #endregion

        #region Low details

        [JsonProperty("email", NullValueHandling = NullValueHandling.Ignore)]
        public string? Email { get; set; }

        [JsonProperty("createdDate", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? CreatedDate { get; set; }

        [JsonProperty("updatedDate", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? UpdatedDate { get; set; }

        #endregion

        #region Medium details

        [JsonProperty("tokens", NullValueHandling = NullValueHandling.Ignore)]
        public List<UserTokenDto>? Tokens { get; set; }

        #endregion

        #region All details

        [JsonProperty("password", NullValueHandling = NullValueHandling.Ignore)]
        public string? Password { get; set; }

        [JsonProperty("salt", NullValueHandling = NullValueHandling.Ignore)]
        public string? Salt { get; set; }

        #endregion

        public CommonUserDto() { }

        public CommonUserDto(CommonUser user, Details details = Details.None) : this(user, null, details) { }

        public CommonUserDto(CommonUser user, List<UserToken<CommonUser>>? tokens = null, Details details = Details.None)
        {
            this.Id = user.Id;
            this.FirstName = user.FirstName;
            this.LastName = user.LastName;

            if (details == Details.None) return;
            this.Email = user.Email;
            this.CreatedDate = user.CreatedDate;
            this.UpdatedDate = user.UpdatedDate;

            if (details == Details.Medium) return;
            this.Tokens = new();
            if (tokens != null) { this.Tokens = tokens.Select(t => new UserTokenDto(t)).ToList(); }
            if (user.AccessToken != null) { this.Tokens.Add(user.AccessToken); }
            if (user.RefreshToken != null) { this.Tokens.Add(user.RefreshToken); }

            if (details == Details.High) return;
            this.Password = user.Password;
            this.Salt = user.Salt;
        }
    }
}