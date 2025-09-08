using System.ComponentModel.DataAnnotations;

namespace CET_Backend.Models.DTOs
{
    public class ExpenseCreateDto
    {
        [Required]
        [StringLength(300)]
        public string Title { get; set; } = string.Empty;


        [StringLength(1000)]
        public string? Notes { get; set; }


        [Required]
        [Range(0, 999999999999.99)]
        public decimal Amount { get; set; }


        public DateTime? SpentOn { get; set; }
        public int? BudgetHeadId { get; set; }
    }
}
