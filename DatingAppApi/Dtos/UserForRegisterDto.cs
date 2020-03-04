using System.ComponentModel.DataAnnotations;

namespace DatingAppApi.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(8, MinimumLength =4, ErrorMessage = "You must specify passwords between 4 and 8 caracters")]
        public string Password { get; set; }
    }
}
