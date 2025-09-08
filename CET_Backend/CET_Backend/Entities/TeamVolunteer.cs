using CET_Backend.Enums;

namespace CET_Backend.Entities
{
    public class TeamVolunteer
    {
        public int TeamId { get; set; }
        public Team? Team { get; set; }

        public int VolunteerId { get; set; }
        public Volunteer? Volunteer { get; set; }

        public TeamRole Role { get; set; }
    }
}
