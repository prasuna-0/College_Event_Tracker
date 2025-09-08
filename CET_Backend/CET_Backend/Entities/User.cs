namespace CET_Backend.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Student";
        public string Semester { get; set; }
        public Student? Student { get; set; }
        public Admin? Admin { get; set; }
        public Coordinator? Coordinator { get; set; }
        public ICollection<NotificationUser> NotificationUsers { get; set; } = new List<NotificationUser>();
        public int? TeamId { get; set; }
        public Team Team { get; set; }
    }
}

