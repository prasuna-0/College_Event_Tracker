using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CET_Backend.Entities
{
    public class BudgetHead
    {
        public int Id { get; set; }

        [Required]
        public int BudgetId { get; set; }
        [ForeignKey(nameof(BudgetId))]
        public virtual Budget Budget { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty; 

        [Column(TypeName = "decimal(18,2)")]
        public decimal AllocatedAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ActualAmount { get; set; } = 0m;

        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
