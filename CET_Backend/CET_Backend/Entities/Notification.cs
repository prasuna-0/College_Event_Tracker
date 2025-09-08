namespace CET_Backend.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? EventId { get; set; }    // optional reference
        public int? BudgetId { get; set; }

        public ICollection<NotificationUser> NotificationUsers { get; set; } = new List<NotificationUser>();
    }
}
