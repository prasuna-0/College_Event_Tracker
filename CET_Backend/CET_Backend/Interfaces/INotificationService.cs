using CET_Backend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CET_Backend.Interfaces
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(Notification notification, List<int> userIds);
        Task<IEnumerable<NotificationUser>> GetUserNotificationsAsync(int userId);
        Task MarkAsReadAsync(int notificationUserId);
        Task<IEnumerable<User>> GetUsersByRoleAsync(string role);
        Task<IEnumerable<User>> GetAllUsersAsync();

        // Optional admin methods
        Task DeleteNotificationAsync(int notificationId);
        Task BroadcastNotificationAsync(Notification notification, string? role = null);
    }
}



