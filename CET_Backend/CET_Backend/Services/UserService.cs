using CET_Backend.Data;
using CET_Backend.Entities;
using CET_Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CET_Backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        public UserService(AppDbContext context) => _context = context;

        public async Task<List<int>> GetUserIdsByRoleAsync(string role)
        {
            return await _context.Users
                .Where(u => u.Role.ToLower() == role.ToLower())
                .Select(u => u.Id)
                .ToListAsync();
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }
        public async Task<bool> ApproveUserAsync(int id, bool approve)
        {
            var user = await GetUserByIdAsync(id);
            if (user == null) return false;

            if (approve)
            {
                user.IsApproved = true;
                user.IsRejected = false;
            }
            else
            {
                user.IsApproved = false;
                user.IsRejected = true;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<User>> GetPendingUsersAsync()
        {
            return await _context.Users
                .Where(u => !u.IsApproved && !u.IsRejected) 
                .ToListAsync();
        }

      
        public async Task<bool> IsFixedAdminAsync(int id)
        {
            var user = await GetUserByIdAsync(id);
            return user != null && user.IsFixedAdmin;
        }
    }
}
