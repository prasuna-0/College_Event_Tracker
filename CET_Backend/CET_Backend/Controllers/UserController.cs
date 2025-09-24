using CET_Backend.Entities;
using CET_Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CET_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
        
        [Authorize]
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveUser(int id, [FromQuery] bool approve)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized("User not found in claims.");

            int currentUserId = int.Parse(userIdClaim);
            var currentUser = await _userService.GetUserByIdAsync(currentUserId);

            if (currentUser == null || !currentUser.IsFixedAdmin)
                return Unauthorized("Only fixed admin can approve or reject users.");

            var success = await _userService.ApproveUserAsync(id, approve);
            if (!success)
                return NotFound("User not found.");

            return Ok(approve ? "User approved successfully." : "User rejected successfully.");
        }

        [Authorize]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingUsers()
        {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var isFixedAdmin = await _userService.IsFixedAdminAsync(currentUserId);

            if (!isFixedAdmin)
                return Unauthorized("Only Fixed Admin can view pending users.");

            var pendingUsers = await _userService.GetPendingUsersAsync();
            return Ok(pendingUsers);
        }

    }
}
