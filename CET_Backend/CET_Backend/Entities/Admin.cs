using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CET_Backend.Entities
{
    public class Admin
    {
     [Key]
    public int AdminId { get; set; }

    [ForeignKey(nameof(User))]
    public int UserId { get; set; }

  
    public DateTime CreatedAt { get; set; }

    public User User { get; set; }
}
    }

