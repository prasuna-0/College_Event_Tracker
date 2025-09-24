using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CET_Backend.Entities
{
    public class Coordinator
    {
        [Key]
        public int CoordinatorId { get; set; }

        [ForeignKey(nameof(User))]
        public int UserId { get; set; }

       
        public DateTime CreatedAt { get; set; }

        public User User { get; set; }
    }
}
