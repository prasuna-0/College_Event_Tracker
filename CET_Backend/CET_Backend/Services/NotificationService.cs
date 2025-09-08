using CET_Backend.Data;
using CET_Backend.Entities;
using CET_Backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CET_Backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateNotificationAsync(Notification notification, List<int> userIds)
        {
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            foreach (var userId in userIds)
            {
                var nu = new NotificationUser
                {
                    NotificationId = notification.Id,
                    UserId = userId,
                    IsRead = false
                };
                await _context.NotificationUsers.AddAsync(nu);
            }
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<NotificationUser>> GetUserNotificationsAsync(int userId)
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

        public async Task<IEnumerable<User>> GetUsersByRoleAsync(string role)
        {
            return await _context.Users
                .Where(u => u.Role == role)
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        // 🔹 Implementing DeleteNotificationAsync
        public async Task DeleteNotificationAsync(int notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification != null)
            {
                // Delete associated NotificationUser entries first
                var notificationUsers = _context.NotificationUsers
                    .Where(nu => nu.NotificationId == notificationId);
                _context.NotificationUsers.RemoveRange(notificationUsers);

                _context.Notifications.Remove(notification);
                await _context.SaveChangesAsync();
            }
        }

        // Optional: broadcast notification to all users or specific role
        public async Task BroadcastNotificationAsync(Notification notification, string? role = null)
        {
            List<int> userIds;
            if (string.IsNullOrEmpty(role))
            {
                userIds = await _context.Users.Select(u => u.Id).ToListAsync();
            }
            else
            {
                userIds = await _context.Users
                    .Where(u => u.Role == role)
                    .Select(u => u.Id)
                    .ToListAsync();
            }

            await CreateNotificationAsync(notification, userIds);
        }
    }
}










