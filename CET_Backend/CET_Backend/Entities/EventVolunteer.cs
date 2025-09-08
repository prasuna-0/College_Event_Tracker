namespace CET_Backend.Entities
{
    public class EventVolunteer
    {
        public int EventId { get; set; }
        public Event? Event { get; set; }

        public int VolunteerId { get; set; }
        public Volunteer? Volunteer { get; set; }

        public string Role { get; set; } = "Member"; // optional per event
    }
}
