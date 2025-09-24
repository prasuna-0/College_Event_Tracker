using CET_Backend.Data;
using CET_Backend.Entities;
using CET_Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CET_Backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        public NotificationService(AppDbContext context) => _context = context;

        public async Task<List<NotificationUser>> GetUserNotificationsAsync(int userId)
        {
            return await _context.NotificationUsers
                .Include(nu => nu.Notification)
                .Where(nu => nu.UserId == userId)
                .OrderByDescending(nu => nu.Notification.CreatedAt)
                .ToListAsync();
        }

        public async Task MarkAsReadAsync(int notificationUserId)
        {
            var nu = await _context.NotificationUsers.FindAsync(notificationUserId);
            if (nu != null)
            {
                nu.IsRead = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task CreateNotificationAsync(Notification notification, List<int> userIds)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            var notificationUsers = userIds.Select(id => new NotificationUser
            {
                NotificationId = notification.Id,
                UserId = id,
                IsRead = false
            }).ToList();

            _context.NotificationUsers.AddRange(notificationUsers);
            await _context.SaveChangesAsync();
        }

        public async Task BroadcastNotificationAsync(Notification notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            var allUserIds = await _context.Users.Select(u => u.Id).ToListAsync();
            var notificationUsers = allUserIds.Select(id => new NotificationUser
            {
                NotificationId = notification.Id,
                UserId = id,
                IsRead = false
            }).ToList();

            _context.NotificationUsers.AddRange(notificationUsers);
            await _context.SaveChangesAsync();
        }
    }
}
