namespace CET_Backend.Models.DTOs
{
    public class BudgetWithHeadsDto
    {
        public int Id { get; set; }           // Budget ID
        public int EventId { get; set; }      // Linked Event
        public string EventTitle { get; set; } = null!; // Optional: event title
        public decimal EstimatedAmount { get; set; }    // Total estimated budget
        public decimal RemainingAmount { get; set; }    // Remaining amount after heads allocation
        public DateTime CreatedAt { get; set; }
        public List<BudgetHeadDto> Heads { get; set; } = new List<BudgetHeadDto>();
    }
}
