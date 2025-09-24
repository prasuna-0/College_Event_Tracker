using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CET_Backend.Entities
{
    public class EventRegistration
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(Event))]
        public int EventId { get; set; }

        [ForeignKey(nameof(Student))]
        public int StudentId { get; set; }

        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;

        public Event Event { get; set; }
        public Student Student { get; set; }
    }
}

