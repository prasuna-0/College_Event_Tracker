namespace CET_Backend.Models.DTOs
{
    public class RegisterDTO
    {
        public string? Username { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "Student";
        public string Semester { get; set; }
    }
}
