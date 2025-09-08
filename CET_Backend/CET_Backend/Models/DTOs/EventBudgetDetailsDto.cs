namespace CET_Backend.Models.DTOs
{
    public class EventBudgetDetailsDTO
    {
        public int EventId { get; set; }
        public string EventName { get; set; }
        public List<BudgetItemDTO> Items { get; set; }
    }
}
