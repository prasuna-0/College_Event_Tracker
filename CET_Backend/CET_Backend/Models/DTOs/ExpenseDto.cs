namespace CET_Backend.Models.DTOs
{
    public class ExpenseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public decimal Amount { get; set; }
        public DateTime SpentOn { get; set; }
        public string? ReceiptUrl { get; set; }
        public int? BudgetHeadId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
