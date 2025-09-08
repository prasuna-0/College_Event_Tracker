using CET_Backend.Data;
using CET_Backend.Models.DTOs;
using CET_Backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CET_Backend.Interfaces;

namespace CET_API.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<string?> RegisterAsync(RegisterDTO dto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                return null;

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
                Semester = dto.Semester
            };

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync(); // first save the User

                // Save role entity
                if (dto.Role.Equals("Student", StringComparison.OrdinalIgnoreCase))
                {
                    var student = new Student
                    {
                        UserId = user.Id,
                        Semester = dto.Semester
                    };
                    _context.Students.Add(student);
                }
                else if (dto.Role.Equals("Admin", StringComparison.OrdinalIgnoreCase))
                {
                    var admin = new Admin
                    {
                        UserId = user.Id,
                    };
                    _context.Admins.Add(admin);
                }
                else if (dto.Role.Equals("Coordinator", StringComparison.OrdinalIgnoreCase))
                {
                    var coordinator = new Coordinator
                    {
                        UserId = user.Id,
                    };
                    _context.Coordinators.Add(coordinator);
                }

                await _context.SaveChangesAsync(); // save role entity
            }
            catch (DbUpdateException ex)
            {
                // Log the full inner exception
                throw new Exception(ex.InnerException?.Message ?? ex.Message);
            }

            return "Registered successfully.";
        }


        public async Task<string?> LoginAsync(LogInDTO dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return null;

            return GenerateJwtToken(user);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
               new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                //new Claim(ClaimTypes.Role, user.Role),
                new Claim("role",user.Role),
                new Claim("Semester", user.Semester ?? "")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

