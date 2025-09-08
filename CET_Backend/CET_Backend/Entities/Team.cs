namespace CET_Backend.Entities
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ICollection<User> Members { get; set; } = new List<User>();
        public ICollection<TeamVolunteer> TeamVolunteers { get; set; } = new List<TeamVolunteer>();
    }
}
