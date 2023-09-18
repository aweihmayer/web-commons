using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCommons.Db
{
    public enum UserTokenType { Access = 0, Refresh = 1, Utility = 2 }

    public static class UserTokenDurations
    {
        public static TimeSpan Refresh = TimeSpan.FromDays(14);
        public static TimeSpan Access = TimeSpan.FromMinutes(30);
    }

    [Table("token")]
    [Index(nameof(Id), IsUnique = true)]
    public class UserToken<TUser> : TimestampableEntity where TUser : CommonUser
    {
        [Column("token")]
        [Key]
        public Guid Id { get; set; }

        #region Columns

        /// <summary>
        /// Codes are used for two-factor verification.
        /// </summary>
        [Column("code")]
        public int? Code { get; set; }

        /// <summary>
        /// Formatted code as a string with at least 6 characters as leading zeros.
        /// </summary>
        [NotMapped]
        public string FormattedCode
        {
            get {
                return this.Code.HasValue ? this.Code.Value.ToString("000000") : "000000";
            }
            set {
                this.Code = int.Parse(value);
            }
        }

        [Column("duration")]
        public TimeSpan? Duration { get; set; }

        [Column("last_name")]
        public DateTime? ExpiryDate { get; set; }

        [Column("type")]
        public UserTokenType Type { get; set; }

        [Column("created_date")]
        public DateTime CreatedDate { get; set; }

        [Column("updated_date")]
        public DateTime UpdatedDate { get; set; }

        #endregion

        #region Relationships

        [Column("user_id")]
        public int? UserId { get; set; }

        [JsonIgnore]
        public virtual TUser? User { get; set; }

        #endregion

        public UserToken() { }

        public UserToken(TUser user, UserTokenType type, bool hasCode = false)
        {
            this.Id = Guid.NewGuid();
            this.Duration = null;
            this.ExpiryDate = null;
            this.UserId = user.Id;
            this.User = user;
            this.Type = type;
            if (hasCode) {
                Random rnd = new();
                this.Code = rnd.Next(0, 9999);
            }
        }

        public UserToken(TUser user, UserTokenType type, TimeSpan duration, bool hasCode = false)
        {
            this.Id = Guid.NewGuid();
            this.Duration = duration;
            this.Refresh();
            this.UserId = user.Id;
            this.User = user;
            this.Type = type;
            if (hasCode) {
                Random rnd = new();
                this.Code = rnd.Next(0, 9999);
            }
        }

        /// <summary>
        /// Refreshes the expiry date and extending the expiration with the token's duration.
        /// </summary>
        public void Refresh()
        {
            if (!this.Duration.HasValue) { return; }
            this.ExpiryDate = DateTime.UtcNow.Add(this.Duration.Value);
        }

        /// <summary>
        /// Determines if the token is expired.
        /// </summary>
        public bool IsExpired()
        {
            if (!this.ExpiryDate.HasValue) { return false; }
            return this.ExpiryDate < DateTime.UtcNow;
        }

        /// <summary>
        /// Returns the remaining time before the token expires.
        /// </summary>
        public TimeSpan? GetRemainingDuration()
        {
            if (!this.ExpiryDate.HasValue) { return null; }
            if (this.IsExpired()) { return TimeSpan.Zero; }
            return this.ExpiryDate - DateTime.UtcNow;
        }
    }
}