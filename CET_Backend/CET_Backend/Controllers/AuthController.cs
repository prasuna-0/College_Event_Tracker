using CET_Backend.Interfaces;
using CET_Backend.Models.DTOs;
using Microsoft.AspNetCore.Http;
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
            {
                return BadRequest("Semester is required for Student role.");
            }
            var result = await _authService.RegisterAsync(dto);
            if (result == null)
                return BadRequest("Username already exists.");

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LogInDTO dto)
        {
            var token = await _authService.LoginAsync(dto);
            if (token == null)
                return Unauthorized("Invalid credentials.");

            return Ok(new { token });
        }


    }
}

