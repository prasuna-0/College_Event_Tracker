using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CET_Backend.Entities
{
    public class Student
    {
        [Key]
        public int SID { get; set; }

        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public string? Batch { get; set; }
        public string? Faculty { get; set; }
        public string? Semester { get; set; }

        public DateTime CreatedAt { get; set; }

        public User User { get; set; }

        public ICollection<Event> Events { get; set; } = new List<Event>();
    }
}
