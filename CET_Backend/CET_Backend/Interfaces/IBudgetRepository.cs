using CET_Backend.Entities;

namespace CET_Backend.Interfaces
{
    public interface IBudgetRepository
    {
        Task<Budget?> GetByIdAsync(int id);
        Task<Budget> UpdateAsync(Budget budget);
        Task<IEnumerable<Budget>> GetBudgetsDueSoonAsync();
        // Additional methods if needed: Create, Delete, etc.
    }
}

