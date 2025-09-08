using CET_Backend.Data;
using CET_Backend.Entities;
using CET_Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CET_Backend.Services
{
    public class BudgetRepository : IBudgetRepository
    {
        private readonly AppDbContext _context;

        public BudgetRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Budget?> GetByIdAsync(int id)
        {
            return await _context.Budgets
                .Include(b => b.Event)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<Budget> UpdateAsync(Budget budget)
        {
            _context.Budgets.Update(budget);
            await _context.SaveChangesAsync();
            return budget;
        }

        public async Task<IEnumerable<Budget>> GetBudgetsDueSoonAsync()
        {
            var today = DateTime.Today;
            var threeDaysLater = today.AddDays(3);

            return await _context.Budgets
                .Include(b => b.Event)
                .Where(b => b.DueDate >= today && b.DueDate <= threeDaysLater)
                .ToListAsync();
        }
    }
}

