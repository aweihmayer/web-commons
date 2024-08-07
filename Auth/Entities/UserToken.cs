﻿using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebCommons.Auth;

namespace WebCommons.Db
{
    public enum UserTokenType { Access = 0, Refresh = 1, Utility = 2 }

    public static class UserTokenDurations
    {
        public static TimeSpan Refresh { get; set; } = TimeSpan.FromDays(15);
        public static TimeSpan Access { get; set; } = TimeSpan.FromMinutes(30);
    }

    [Table("token")]
    [Index(nameof(EncryptedId), IsUnique = true)]
    public class UserToken<TUser> : IUserToken, ITimestampableEntity where TUser : CommonUser
    {
        [Column("encrypted_id")]
        [Key]
        public string EncryptedId { get; set; }

        [NotMapped]
        public Guid Id {
            get => this.value;
            set {
                this.EncryptedId = value.Encrypt();
                this.value = value;
            }
        }

        private Guid value;

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
        public string? FormattedCode
        {
            get => this.Code.HasValue ? this.Code.Value.ToString("000000") : null;
            set {
                this.Code = int.Parse(value);
            }
        }

        [Column("duration")]
        public TimeSpan? Duration { get; set; }

        [Column("expiration_date")]
        public DateTime? ExpirationDate { get; set; }

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
            this.ExpirationDate = null;
            this.CreatedDate = DateTime.UtcNow;
            this.UpdatedDate = DateTime.UtcNow;
            this.UserId = user.Id;
            this.User = user;
            this.Type = type;
            if (hasCode) this.Code = new Random().Next(0, 9999);
        }

        public UserToken(TUser user, UserTokenType type, TimeSpan duration, bool hasCode = false)
        {
            this.Id = Guid.NewGuid();
            this.Duration = duration;
            this.CreatedDate = DateTime.UtcNow;
            this.Refresh();
            this.UserId = user.Id;
            this.User = user;
            this.Type = type;
            if (hasCode) this.Code = new Random().Next(0, 9999);
        }

        /// <summary>
        /// Refreshes the expiration date and extending the expiration with the token's duration.
        /// </summary>
        public void Refresh()
        {
            if (this.Duration.HasValue) this.ExpirationDate = DateTime.UtcNow.Add(this.Duration.Value);
            this.UpdatedDate = DateTime.UtcNow;
        }

        /// <summary>
        /// Expires a token by setting its expiration date to the minimum value.
        /// </summary>
        public void Expire()
        {
            this.ExpirationDate = DateTime.MinValue;
            this.UpdatedDate = DateTime.UtcNow;
        }

        /// <summary>
        /// Determines if the token is expired.
        /// </summary>
        public bool IsExpired()
        {
            if (!this.ExpirationDate.HasValue) return false;
            else return this.ExpirationDate < DateTime.UtcNow;
        }

        /// <summary>
        /// Returns the remaining time before the token expires.
        /// </summary>
        public TimeSpan? GetRemainingDuration()
        {
            if (!this.ExpirationDate.HasValue) return null;
            else if (this.IsExpired()) return TimeSpan.Zero;
            else return this.ExpirationDate - DateTime.UtcNow;
        }
    }

    public interface IUserToken
    {
        public string EncryptedId { get; set; }
        public Guid Id { get; set; }
        public int? Code { get; set; }
        public string? FormattedCode { get; set; }
        public TimeSpan? Duration { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public UserTokenType Type { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int? UserId { get; set; }
    }
}