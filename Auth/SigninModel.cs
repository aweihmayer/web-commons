using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace WebCommons.Auth
{
    public class SigninModel
    {
        [DisplayName("Email")]
        [EmailAddress]
        [Required]
        [StringLength(255)]
        public string? Email { get; set; }

        [DisplayName("Password")]
        [Required]
        [StringLength(50)]
        public string? Password { get; set; }
    }
}