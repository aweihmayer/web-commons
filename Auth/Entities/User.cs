using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebCommons.Dto;

namespace WebCommons.Db
{
    [Table("app_user")]
    [Index(nameof(Id), IsUnique = true)]
    public abstract class CommonUser : ITimestampableEntity
    {
        [Column("id")]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        #region Columns

        [Column("email", TypeName = "varchar(255)")]
        public string? Email { get; set; }

        [Column("username", TypeName = "varchar(255)")]
        public string? Username { get; set; }

        [Column("password", TypeName = "varchar(255)")]
        public string? Password { get; set; }

        [Column("salt", TypeName = "varchar(10)")]
        public string? Salt { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; }

        [Column("last_auth_date")]
        public DateTime? LastAuthDate { get; set; }

        [Column("created_date")]
        public DateTime CreatedDate { get; set; }

        [Column("updated_date")]
        public DateTime UpdatedDate { get; set; }

        #endregion

        #region Relationships

        /// <summary>
        /// Utility property to pass the access token id.
        /// </summary>
        [NotMapped]
        public UserTokenDto? AccessToken { get; set; }

        /// <summary>
        /// Utility property to pass the refresh id.
        /// </summary>
        [NotMapped]
        public UserTokenDto? RefreshToken { get; set; }

        #endregion
    }
}