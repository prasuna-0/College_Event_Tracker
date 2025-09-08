using CET_Backend.Models.DTOs;

namespace CET_Backend.Interfaces
{
    public interface IAuthService
    {
        Task<string?> RegisterAsync(RegisterDTO dto);
        Task<string?> LoginAsync(LogInDTO dto);
    }
}
