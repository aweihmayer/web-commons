using Newtonsoft.Json;
using WebCommons.Db;

namespace WebCommons.Dto
{
    public class UserDto : CommonDto
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

        public UserDto() { }

        public UserDto(CommonUser user, List<UserToken<CommonUser>>? tokens = null, Details details = Details.None)
        {
            this.Id = user.Id;
            this.FirstName = user.FirstName;
            this.LastName = user.LastName;

            if (details == Details.None) { return; }
            this.Email = user.Email;
            this.System = new SystemDto(user);

            if (details == Details.Medium) { return; }
            if (tokens != null) { this.Tokens = tokens.Select(t => new UserTokenDto(t)).ToList(); }

            if (details == Details.High) { return; }
            this.Password = user.Password;
            this.Salt = user.Salt;
        }
    }
}