using System.ComponentModel.DataAnnotations;

namespace CET_Backend.Entities
{
    public class Role
    {
        [Key]
        public int RId { get; set; }
        public string RoleName { get; set; }
    }
}
