using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCommons.Db
{
    [Table("token")]
    [Index(nameof(Id), IsUnique = true)]
    public class Token<TUser> where TUser : CommonUser
    {
        [Column("token")]
        [Key]
        public Guid Id { get; set; }

        /// <summary>
        /// Codes are used for two-factor verifications.
        /// </summary>
        [Column("code")]
        public int? Code { get; set; }

        [NotMapped]
        public string FormattedCode
        {
            get {
                return this.Code.HasValue ? this.Code.Value.ToString("0000") : "0000";
            }
            set {
                this.Code = int.Parse(value);
            }
        }

        [Column("duration")]
        public TimeSpan Duration { get; set; }

        [Column("last_name")]
        public DateTime ExpiryDate { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [JsonIgnore]
        public virtual TUser User { get; set; }

        public Token(TUser user, TimeSpan duration, bool hasCode = false)
        {
            this.Id = Guid.NewGuid();
            this.Duration = duration;
            this.ExpiryDate = DateTime.UtcNow.Add(duration);
            this.UserId = user.Id;

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
            this.ExpiryDate = DateTime.UtcNow.Add(this.Duration);
        }

        /// <summary>
        /// Determines if the token is expired.
        /// </summary>
        public bool IsExpired()
        {
            return this.ExpiryDate < DateTime.UtcNow;
        }

        /// <summary>
        /// Returns the remaining time before the token expires.
        /// </summary>
        public TimeSpan GetRemainingDuration()
        {
            if (this.IsExpired()) { return TimeSpan.Zero; }
            return this.ExpiryDate - DateTime.UtcNow;
        }
    }
}