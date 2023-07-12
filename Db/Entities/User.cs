using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCommons.Db
{
    [Table("app_user")]
    [Index(nameof(Id), IsUnique = true)]
    public abstract class CommonUser
    {
        [Column("id")]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("first_name", TypeName = DbColumns.NAME_VARCHAR)]
        public string? FirstName { get; set; }

        [Column("last_name", TypeName = DbColumns.NAME_VARCHAR)]
        public string? LastName { get; set; }

        [Column("email", TypeName = DbColumns.MAX_VARCHAR)]
        public string? Email { get; set; }

        [Column("password", TypeName = DbColumns.MAX_VARCHAR)]
        public string? Password { get; set; }

        [Column("salt", TypeName = DbColumns.TINY_VARCHAR)]
        public string? Salt { get; set; }

        [Column("active")]
        public bool Active { get; set; }

        [Column("auth_token_id")]
        public Guid? AuthTokenId { get; set; }
    }
}