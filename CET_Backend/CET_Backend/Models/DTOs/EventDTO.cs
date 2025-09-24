namespace CET_Backend.Models.DTOs
{
    public class EventDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string EventStatus { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Faculty { get; set; } = string.Empty;
        public string EventScope { get; set; } = string.Empty;
        public string EventType { get; set; } = string.Empty;
        public string Objective { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int? TeamId { get; set; }
    }
}
