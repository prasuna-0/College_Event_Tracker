using CET_Backend.DTOs;
using CET_Backend.Entities;
using CET_Backend.Models.DTOs;
using CET_Backend.Models;
using Microsoft.AspNetCore.Http;

namespace CET_Backend.Interfaces
{
    public interface IBudgetService
    {
        // Budget overall
        Task<Budget> AllocateAsync(BudgetAllocateDto dto);
        Task<Budget> UpdateAsync(int eventId, BudgetUpdateDto dto);
        Task<List<BudgetWithHeadsDto>> GetAllBudgetsAsync();
        Task<Budget?> GetByEventIdAsync(int eventId);
        Task<IReadOnlyList<EventDTO>> GetAllEventsAsync();
        Task<BudgetSummaryDto?> GetSummaryAsync(int eventId, string baseUrl);
        Task<bool> DeleteBudgetAsync(int budgetId);

        // Expenses
        Task<Expense> AddExpenseAsync(int eventId, ExpenseCreateDto dto, IFormFile? receipt, string baseUrl);
        Task<Expense?> UpdateExpenseAsync(int eventId, int expenseId, ExpenseUpdateDto dto, IFormFile? receipt);
        Task<bool> DeleteExpenseAsync(int eventId, int expenseId);
        Task<IReadOnlyList<Expense>> GetExpensesAsync(int eventId);

        // Budget Heads
        Task<BudgetHead> AddBudgetHeadAsync(int budgetId, BudgetHeadCreateDto dto);
        Task<BudgetHead?> UpdateBudgetHeadAsync(int headId, BudgetHeadUpdateDto dto);
        Task<bool> DeleteBudgetHeadAsync(int headId);
        Task<IReadOnlyList<BudgetHeadSummaryDto>> GetBudgetHeadsAsync(int budgetId);
    }
}
