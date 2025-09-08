namespace CET_Backend.Models.DTOs
{
    public class APIResponse<T>
    {
       
            public bool Success { get; set; }
            public string Message { get; set; } = string.Empty;
            public T? Data { get; set; }
            public List<string> Errors { get; set; } = new List<string>();
            public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        }

        public class APIResponse : APIResponse<object>
        {
        }
    }

