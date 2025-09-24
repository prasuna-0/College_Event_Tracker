namespace CET_Backend.Models.DTOs
{
    public class TargetedNotificationDto
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public List<int> UserIds { get; set; } = new();
    }
}
