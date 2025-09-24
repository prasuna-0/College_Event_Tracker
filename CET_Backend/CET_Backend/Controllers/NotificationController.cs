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
        private readonly IUserService _userService;

        public NotificationController(INotificationService notificationService, IUserService userService)
        {
            _notificationService = notificationService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int.TryParse(userIdStr, out int userId);

            var notifications = await _notificationService.GetUserNotificationsAsync(userId);

            return Ok(notifications.Select(nu => new NotificationDto
            {
                Id = nu.Id,
                Title = nu.Notification.Title,
                Message = nu.Notification.Message,
                CreatedAt = nu.Notification.CreatedAt,
                IsRead = nu.IsRead
            }));
        }

        [HttpPut("mark-as-read/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            await _notificationService.MarkAsReadAsync(id);
            return NoContent();
        }

        [HttpPost("broadcast-to-role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> BroadcastToRole([FromBody] RoleBroadcastDto dto)
        {
            var userIds = await _userService.GetUserIdsByRoleAsync(dto.Role);

            if (!userIds.Any())
                return NotFound(new { message = $"No users found for role {dto.Role}" });

            var notification = new Notification
            {
                Title = dto.Title,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow
            };

            await _notificationService.CreateNotificationAsync(notification, userIds);

            return Ok(new { message = $"Notification sent to {dto.Role}s." });
        }

        [HttpPost("send-to-selected")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SendToSelected([FromBody] TargetedNotificationDto dto)
        {
            if (dto.UserIds == null || !dto.UserIds.Any())
                return BadRequest(new { message = "No users selected." });

            var notification = new Notification
            {
                Title = dto.Title,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow
            };

            await _notificationService.CreateNotificationAsync(notification, dto.UserIds);
            return Ok(new { message = "Notification sent to selected users." });
        }
    }

    public class RoleBroadcastDto
    {
        public string Role { get; set; } = "";
        public string Title { get; set; } = "";
        public string Message { get; set; } = "";
    }

    public class TargetedNotificationDto
    {
        public List<int> UserIds { get; set; } = new();
        public string Title { get; set; } = "";
        public string Message { get; set; } = "";
    }
}
