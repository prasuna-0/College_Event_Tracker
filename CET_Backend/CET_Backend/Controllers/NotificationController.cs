using CET_Backend.Entities;
using CET_Backend.Interfaces;
using CET_Backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CET_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int.TryParse(userIdStr, out int userId);

            var notifications = await _notificationService.GetUserNotificationsAsync(userId);
            return Ok(notifications);
        }

        [HttpPut("mark-as-read/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            await _notificationService.MarkAsReadAsync(id);
            return NoContent();
        }

        [HttpPost("broadcast")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> BroadcastNotification([FromBody] BroadcastDto dto)
        {
            var users = await _notificationService.GetAllUsersAsync();
            var userIds = users.Select(u => u.Id).ToList();

            var notification = new Notification
            {
                Title = dto.Title,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow
            };

            await _notificationService.CreateNotificationAsync(notification, userIds);
            return Ok(new { message = "Notification sent to all users." });
        }
    }
}




