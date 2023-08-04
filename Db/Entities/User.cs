using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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

        /// <summary>
        /// Utility property to pass the token id to the authentification method.
        /// If you want relationship properties, you must define them yourself.
        /// </summary>
        [JsonIgnore]
        [NotMapped]
        public virtual Guid? AuthTokenId { get; set; }

        /*
        [JsonIgnore]
        public virtual List<TToken> Tokens { get; set; } = new List<TToken>();

        [JsonIgnore]
        [NotMapped]
        public virtual TToken? Token { get; set; }*/
    }
}