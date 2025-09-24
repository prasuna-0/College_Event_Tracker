using CET_Backend.Entities;

public interface IUserService
{
    Task<List<int>> GetUserIdsByRoleAsync(string role);
    Task<List<User>> GetAllUsersAsync();
    Task<User> GetUserByIdAsync(int id);
    Task<List<User>> GetPendingUsersAsync();
    Task<bool> ApproveUserAsync(int id, bool approve);
    Task<bool> IsFixedAdminAsync(int id);
}
