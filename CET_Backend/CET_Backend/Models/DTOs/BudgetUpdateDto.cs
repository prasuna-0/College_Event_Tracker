using System.ComponentModel.DataAnnotations;

namespace CET_Backend.Models.DTOs
{
    public class BudgetUpdateDto
    {
        [Required]
        [Range(0, 999999999999.99)]
        public decimal EstimatedAmount { get; set; }
    }
}
