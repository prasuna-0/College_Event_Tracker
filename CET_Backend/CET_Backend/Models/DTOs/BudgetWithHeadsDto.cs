namespace CET_Backend.Models.DTOs
{
    public class BudgetWithHeadsDto
    {
        public int Id { get; set; }           
        public int EventId { get; set; }      
        public string EventTitle { get; set; } = null!; 
        public decimal EstimatedAmount { get; set; }    
        public decimal RemainingAmount { get; set; }    
        public DateTime CreatedAt { get; set; }
        public List<BudgetHeadDto> Heads { get; set; } = new List<BudgetHeadDto>();
    }
}
