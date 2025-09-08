namespace CET_Backend.Entities
{
    public class Photo
    {
        public int Id { get; set; }
        public int AlbumId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string Url { get; set; }
        public DateTime UploadedAt { get; set; }

        public Album Album { get; set; }
    }
}
