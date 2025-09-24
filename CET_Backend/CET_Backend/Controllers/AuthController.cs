using CET_Backend.Entities;
using CET_Backend.Interfaces;
using CET_Backend.Models.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CET_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

       

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            if (dto.Role.Equals("Student", StringComparison.OrdinalIgnoreCase) && string.IsNullOrWhiteSpace(dto.Semester))
                return BadRequest("Semester is required for Student role.");

            if (!dto.Role.Equals("Student", StringComparison.OrdinalIgnoreCase))
                dto.Semester = "";

            var result = await _authService.RegisterAsync(dto);
            if (result == null)
                return BadRequest("Username already exists.");

            return Ok("Registered successfully. Wait for admin approval.");
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LogInDTO dto)
        {
            var user = await _authService.GetUserByUsernameAsync(dto.Username); 
            if (user == null || !await _authService.CheckPasswordAsync(user, dto.Password))
                return Unauthorized("Invalid credentials.");

            if (!user.IsApproved)
                return Unauthorized("Your account is not approved by admin.");

            var token = await _authService.GenerateTokenAsync(user);

            return Ok(new { token, role = user.Role });
        }



    }
}

