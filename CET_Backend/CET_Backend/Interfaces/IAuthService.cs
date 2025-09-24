using CET_Backend.Entities;
using CET_Backend.Models.DTOs;

namespace CET_Backend.Interfaces
{
    public interface IAuthService
    {
        Task<User?> GetUserByUsernameAsync(string username);
        Task<bool> CheckPasswordAsync(User user, string password);
        Task<string?> GenerateTokenAsync(User user);
        Task<string?> RegisterAsync(RegisterDTO dto);
        Task<string?> LoginAsync(LogInDTO dto);
    }
}
