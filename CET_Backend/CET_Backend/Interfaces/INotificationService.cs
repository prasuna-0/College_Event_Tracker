



using CET_Backend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CET_Backend.Interfaces
{
    public interface INotificationService
    {
        Task<List<NotificationUser>> GetUserNotificationsAsync(int userId);
        Task MarkAsReadAsync(int notificationUserId);
        Task CreateNotificationAsync(Notification notification, List<int> userIds);
        Task BroadcastNotificationAsync(Notification notification);
    }
}
