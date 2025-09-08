namespace CET_Backend.Models.DTOs
{

    public class BudgetHeadSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal AllocatedAmount { get; set; }
        public decimal ActualAmount { get; set; }
        public decimal Variance => ActualAmount - AllocatedAmount;
        public string Status => ActualAmount <= AllocatedAmount ? "WithinBudget" : "OverBudget";
    }
}
