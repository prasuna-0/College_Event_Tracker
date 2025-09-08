namespace CET_Backend.Entities
{
    public class Album
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }

        public List<Photo> Photos { get; set; }
    }
}
