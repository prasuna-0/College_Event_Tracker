using System.ComponentModel.DataAnnotations;

namespace CET_Backend.Models.DTOs
{
    public class BudgetHeadUpdateDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0, 999999999999.99)]
        [Required]
        public decimal AllocatedAmount { get; set; }
        //public decimal ActualExpense { get; set; }
        [Required]
        [Range(0, double.MaxValue)]
        public decimal ActualAmount { get; set; }

        //public string? Notes { get; set; }
    }
}
