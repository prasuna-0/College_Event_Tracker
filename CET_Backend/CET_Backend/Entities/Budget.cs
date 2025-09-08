using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace CET_Backend.Entities
{
    public class Budget
    {
        public int Id { get; set; }


        [Required]
        [ForeignKey(nameof(Event))]
        public int EventId { get; set; }
        public Event? Event { get; set; }


        [Required]
        [Column(TypeName = "decimal(18,2)")]
        [Range(0, 999999999999.99)]
        public decimal EstimatedAmount { get; set; }
        public DateTime DueDate { get; set; }

        // Computed from Expenses; persisted for easy queries but kept in sync in service
        [Column(TypeName = "decimal(18,2)")]
        public decimal ActualAmount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;


        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
        public ICollection<BudgetHead> BudgetHeads { get; set; } = new List<BudgetHead>();
    }
}
