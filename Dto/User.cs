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

        [JsonProperty("authToken", NullValueHandling = NullValueHandling.Ignore)]
        public Guid? AuthToken { get; set; }

        #endregion

        #region High details

        [JsonProperty("password", NullValueHandling = NullValueHandling.Ignore)]
        public string? Password { get; set; }

        [JsonProperty("salt", NullValueHandling = NullValueHandling.Ignore)]
        public string? Salt { get; set; }

        #endregion

        public UserDto() { }

        public UserDto(CommonUser user, Details details)
        {
            this.Id = user.Id;
            this.FirstName = user.FirstName;
            this.LastName = user.LastName;

            if (details == Details.None) { return; }
            this.Email = user.Email;

            if (details == Details.Low) { return; }
            this.AuthToken = user.AuthTokenId;

            if (details == Details.Medium) { return; }
            this.Password = user.Password;
            this.Salt = user.Salt;
        }
    }
}