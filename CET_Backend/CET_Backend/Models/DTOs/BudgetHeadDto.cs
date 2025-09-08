namespace CET_Backend.Models.DTOs
{
    public class BudgetHeadDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal AllocatedAmount { get; set; }
        public decimal ActualAmount { get; set; }
    }
}
