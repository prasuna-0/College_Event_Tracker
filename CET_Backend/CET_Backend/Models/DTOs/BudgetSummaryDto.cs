namespace CET_Backend.Models.DTOs
{
    public class BudgetSummaryDto
    {
        public int EventId { get; set; }
        public decimal EstimatedAmount { get; set; }
        public decimal ActualAmount { get; set; }
        public decimal Variance => ActualAmount - EstimatedAmount;
        public string Status => ActualAmount <= EstimatedAmount ? "WithinBudget" : "OverBudget";
        public List<ExpenseDto> Expenses { get; set; } = new();
        public List<BudgetHeadDto> BudgetHeads { get; set; } = new();
    }
}
