using System.ComponentModel.DataAnnotations;
using CET_Backend.Enums;

namespace CET_Backend.Entities
{
    public class Event
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public EventStatus EventStatus { get; set; }

        [Required]
        [StringLength(200)]
        public string Location { get; set; } = string.Empty;

        [Required]
        public Faculty Faculty { get; set; }

        [Required]
        public EventScope EventScope { get; set; }

        [Required]
        [StringLength(100)]
        public string EventType { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Objective { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<EventVolunteer> EventVolunteers { get; set; } = new List<EventVolunteer>();
        public int? TeamId { get; set; }
        public Team? Team { get; set; }
    }
}

