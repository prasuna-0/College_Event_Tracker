﻿namespace CET_Backend.Entities
{
    public class NotificationUser
    {
        public int Id { get; set; }

        public int NotificationId { get; set; }
        public Notification Notification { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public bool IsRead { get; set; } = false;
    }
}
