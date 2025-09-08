using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace CET_Backend.Entities
{
    public class Expense
    {
        public int Id { get; set; }


        [Required]
        [ForeignKey(nameof(Budget))]
        public int BudgetId { get; set; }
        public Budget? Budget { get; set; }


        [Required]
        [StringLength(300)]
        public string Title { get; set; } = string.Empty;


        [StringLength(1000)]
        public string? Notes { get; set; }


        [Required]
        [Column(TypeName = "decimal(18,2)")]
        [Range(0, 999999999999.99)]
        public decimal Amount { get; set; }


        [Required]
        public DateTime SpentOn { get; set; } = DateTime.UtcNow;


        // Stored as relative path under wwwroot
        [StringLength(500)]
        public string? ReceiptPath { get; set; }
        public int? BudgetHeadId { get; set; }
        public BudgetHead? BudgetHead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
