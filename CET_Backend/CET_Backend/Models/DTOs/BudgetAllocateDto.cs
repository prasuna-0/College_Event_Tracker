using System.ComponentModel.DataAnnotations;


namespace CET_Backend.DTOs
{
    public class BudgetAllocateDto
    {
        [Required]
        public int EventId { get; set; }


        [Required]
        [Range(0, 999999999999.99)]
        public decimal EstimatedAmount { get; set; }
    }
}
