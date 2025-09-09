using System.ComponentModel.DataAnnotations.Schema;

namespace CET_Backend.Entities
{
    public class Volunteer
    {
        public int Id { get; set; }
        public int SID { get; set; } 
        [ForeignKey("SID")]
        public Student? Student { get; set; }  
        public string? RoleInEvent { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public ICollection<EventVolunteer> EventVolunteers { get; set; } = new List<EventVolunteer>();
        public ICollection<TeamVolunteer> TeamVolunteers { get; set; } = new List<TeamVolunteer>();
    }
}
