using System.ComponentModel.DataAnnotations;

namespace CET_Backend.Models.DTOs
{
    public class CreateEventDto
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Start date is required")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required")]
        public DateTime EndDate { get; set; }

        [Required(ErrorMessage = "Event status is required")]
        public string EventStatus { get; set; } = string.Empty;

        [Required(ErrorMessage = "Location is required")]
        [StringLength(200, ErrorMessage = "Location cannot exceed 200 characters")]
        public string Location { get; set; } = string.Empty;

        [Required(ErrorMessage = "Faculty is required")]
        public string Faculty { get; set; } = string.Empty;

        [Required(ErrorMessage = "Event scope is required")]
        public string EventScope { get; set; } = string.Empty;

        [Required(ErrorMessage = "Event type is required")]
        [StringLength(100, ErrorMessage = "Event type cannot exceed 100 characters")]
        public string EventType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Objective is required")]
        [StringLength(500, ErrorMessage = "Objective cannot exceed 500 characters")]
        public string Objective { get; set; } = string.Empty;
    }
}
