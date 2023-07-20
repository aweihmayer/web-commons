using System.ComponentModel.DataAnnotations;

namespace WebCommons.Auth
{
    public class SigninModel
    {
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string? Email { get; set; }

        [Required]
        [StringLength(50)]
        public string? Password { get; set; }
    }
}