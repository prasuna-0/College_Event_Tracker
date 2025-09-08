using System.ComponentModel.DataAnnotations;

namespace CET_Backend.Models.DTOs
{
    public class BudgetHeadUpdateDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0, 999999999999.99)]
        public decimal AllocatedAmount { get; set; }
    }
}
