using Azure.Core;
using CET_Backend.Data;
using CET_Backend.DTOs;
using CET_Backend.Entities;
using CET_Backend.Interfaces;
using CET_Backend.Models;
using CET_Backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CET_Backend.Services
{
    public class BudgetService : IBudgetService
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;


        private static readonly string[] AllowedReceiptExtensions = new[] { ".png", ".jpg", ".jpeg", ".pdf" };
        private const long MaxReceiptBytes = 10 * 1024 * 1024; // 10 MB


        public BudgetService(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }
        public async Task<List<BudgetWithHeadsDto>> GetAllBudgetsAsync()
        {
            var budgets = await _db.Budgets
                .Include(b => b.BudgetHeads)
                .Include(b => b.Event)
                .ToListAsync();

            return budgets.Select(b => new BudgetWithHeadsDto
            {
                Id = b.Id,
                EventId = b.EventId,
                EventTitle = b.Event.Title,
                EstimatedAmount = b.EstimatedAmount,
                Heads = b.BudgetHeads.Select(h => new BudgetHeadDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    AllocatedAmount = h.AllocatedAmount
                }).ToList()
            }).ToList();
        }


        public async Task<Budget> AllocateAsync(BudgetAllocateDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "Budget allocation data cannot be null");

            // Find the event
            var ev = await _db.Events.FindAsync(dto.EventId);
            if (ev == null)
                throw new KeyNotFoundException("Event not found.");

            // Check if budget already exists
            var existingBudget = await _db.Budgets
                .FirstOrDefaultAsync(b => b.EventId == dto.EventId);
            if (existingBudget != null)
                throw new InvalidOperationException("Budget already allocated for this event.");

            // Create new budget
            var budget = new Budget
            {
                EventId = dto.EventId,
                EstimatedAmount = dto.EstimatedAmount,
                ActualAmount = 0m,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Budgets.Add(budget);
            await _db.SaveChangesAsync();

            return budget;
        }

        //public async Task<Budget> AllocateAsync(BudgetAllocateDto dto)
        //{
        //    var exists = await _db.Events.AnyAsync(e => e.Id == dto.EventId);
        //    if (!exists) throw new KeyNotFoundException($"Event {dto.EventId} not found");


        //    var existing = await _db.Budgets.SingleOrDefaultAsync(b => b.EventId == dto.EventId);
        //    if (existing != null) throw new InvalidOperationException("Budget already allocated for this event.");


        //    var budget = new Budget
        //    {
        //        EventId = dto.EventId,
        //        EstimatedAmount = dto.EstimatedAmount,
        //        ActualAmount = 0m,
        //        CreatedAt = DateTime.UtcNow,
        //        UpdatedAt = DateTime.UtcNow
        //    };
        //    _db.Budgets.Add(budget);
        //    await _db.SaveChangesAsync();
        //    return budget;
        //}
        public async Task<IReadOnlyList<EventDTO>> GetAllEventsAsync()
        {
            return await _db.Events
                .Select(e => new EventDTO
                {
                    Id = e.Id,
                    Title = e.Title
                })
                .ToListAsync();
        }
        public async Task<Budget> UpdateAsync(int eventId, BudgetUpdateDto dto)
        {
            var budget = await _db.Budgets.SingleOrDefaultAsync(b => b.EventId == eventId)
            ?? throw new KeyNotFoundException("Budget not found");


            budget.EstimatedAmount = dto.EstimatedAmount;
            budget.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return budget;
        }
        public Task<Budget?> GetByEventIdAsync(int eventId)
        {
            return _db.Budgets.Include(b => b.Expenses)
            .SingleOrDefaultAsync(b => b.EventId == eventId);
        }
        //        public async Task<BudgetSummaryDto?> GetSummaryAsync(int eventId, string baseUrl)
        //        {
        //            var budget = await _db.Budgets.Include(b => b.Expenses)
        //            .SingleOrDefaultAsync(b => b.EventId == eventId);
        //            if (budget == null) return null;


        //            // Ensure ActualAmount is in sync with expenses
        //            var actual = budget.Expenses.Sum(x => x.Amount);
        //            if (actual != budget.ActualAmount)
        //            {
        //                budget.ActualAmount = actual;
        //                budget.UpdatedAt = DateTime.UtcNow;
        //                await _db.SaveChangesAsync();
        //            }
        //            return new BudgetSummaryDto
        //            {
        //                EventId = budget.EventId,
        //                EstimatedAmount = budget.EstimatedAmount,
        //                ActualAmount = budget.ActualAmount,
        //                Expenses = budget.Expenses
        //.OrderByDescending(e => e.SpentOn)
        //.Select(e => new ExpenseDto
        //{
        //    Id = e.Id,
        //    Title = e.Title,
        //    Notes = e.Notes,
        //    Amount = e.Amount,
        //    SpentOn = e.SpentOn,
        //    ReceiptUrl = string.IsNullOrWhiteSpace(e.ReceiptPath) ? null : CombineToPublicUrl(baseUrl, e.ReceiptPath)
        //}).ToList()
        //            };
        //        }
        public async Task<BudgetSummaryDto?> GetSummaryAsync(int eventId, string baseUrl)
        {
            var budget = await _db.Budgets
                .Include(b => b.Expenses)
                .Include(b => b.BudgetHeads)
                .ThenInclude(h => h.Expenses)
                .SingleOrDefaultAsync(b => b.EventId == eventId);

            if (budget == null) return null;

            // Sync actual amounts
            budget.ActualAmount = budget.Expenses.Sum(x => x.Amount);
            foreach (var head in budget.BudgetHeads)
                head.ActualAmount = head.Expenses.Sum(e => e.Amount);

            await _db.SaveChangesAsync();

            // Map to DTO
            var dto = new BudgetSummaryDto
            {
                EventId = budget.EventId,
                EstimatedAmount = budget.EstimatedAmount,
                ActualAmount = budget.ActualAmount,
                Expenses = budget.Expenses.Select(e => new ExpenseDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    Notes = e.Notes,
                    Amount = e.Amount,
                    SpentOn = e.SpentOn,
                    ReceiptUrl = string.IsNullOrWhiteSpace(e.ReceiptPath) ? null : CombineToPublicUrl(baseUrl, e.ReceiptPath),
                    BudgetHeadId = e.BudgetHeadId
                }).ToList(),
                BudgetHeads = budget.BudgetHeads.Select(h => new BudgetHeadDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    AllocatedAmount = h.AllocatedAmount,
                    ActualAmount = h.ActualAmount
                }).ToList()
            };

            return dto;
        }

        public async Task<bool> DeleteBudgetAsync(int budgetId)
        {
            var budget = await _db.Budgets
                .Include(b => b.Expenses)
                .Include(b => b.BudgetHeads)
                .SingleOrDefaultAsync(b => b.Id == budgetId);

            if (budget == null) return false;

            // Remove expenses
            _db.Expenses.RemoveRange(budget.Expenses);

            // Remove budget heads
            _db.BudgetHeads.RemoveRange(budget.BudgetHeads);

            // Remove budget
            _db.Budgets.Remove(budget);

            await _db.SaveChangesAsync();
            return true;
        }
        public async Task<Expense> AddExpenseAsync(int eventId, ExpenseCreateDto dto, IFormFile? receipt, string baseUrl)
        {
            var budget = await _db.Budgets
                .Include(b => b.BudgetHeads)
                .SingleOrDefaultAsync(b => b.EventId == eventId)
                ?? throw new KeyNotFoundException("Budget not found for event.");

            string? savedReceiptPath = await SaveReceiptAsync(eventId, receipt);

            var expense = new Expense
            {
                BudgetId = budget.Id,
                Title = dto.Title,
                Notes = dto.Notes,
                Amount = dto.Amount,
                SpentOn = dto.SpentOn ?? DateTime.UtcNow,
                ReceiptPath = savedReceiptPath,
                BudgetHeadId = dto.BudgetHeadId
            };

            _db.Expenses.Add(expense);

            // Update budget actual
            budget.ActualAmount += expense.Amount;

            // Update budget head actual
            if (dto.BudgetHeadId.HasValue)
            {
                var head = budget.BudgetHeads.SingleOrDefault(h => h.Id == dto.BudgetHeadId.Value);
                if (head != null) head.ActualAmount += expense.Amount;
            }

            budget.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            // Optionally, attach full URL to receipt for frontend
            if (!string.IsNullOrEmpty(expense.ReceiptPath))
                expense.ReceiptPath = $"{baseUrl.TrimEnd('/')}/{expense.ReceiptPath.TrimStart('/')}";

            return expense;
        }


       

        public async Task<Expense?> UpdateExpenseAsync(int eventId, int expenseId, ExpenseUpdateDto dto, IFormFile? receipt)
        {
            var budget = await _db.Budgets
                .Include(b => b.BudgetHeads)
                .Include(b => b.Expenses)
                .SingleOrDefaultAsync(b => b.EventId == eventId);
            if (budget == null) return null;

            var exp = await _db.Expenses.SingleOrDefaultAsync(e => e.Id == expenseId && e.BudgetId == budget.Id);
            if (exp == null) return null;

            // Update budget actual
            budget.ActualAmount -= exp.Amount;
            budget.ActualAmount += dto.Amount;

            // Update previous head actual
            if (exp.BudgetHeadId.HasValue)
            {
                var prevHead = budget.BudgetHeads.SingleOrDefault(h => h.Id == exp.BudgetHeadId.Value);
                if (prevHead != null) prevHead.ActualAmount -= exp.Amount;
            }

            // Update new head actual
            if (dto.BudgetHeadId.HasValue)
            {
                var newHead = budget.BudgetHeads.SingleOrDefault(h => h.Id == dto.BudgetHeadId.Value);
                if (newHead != null) newHead.ActualAmount += dto.Amount;
            }

            exp.Title = dto.Title;
            exp.Notes = dto.Notes;
            exp.Amount = dto.Amount;
            exp.SpentOn = dto.SpentOn ?? exp.SpentOn;
            exp.BudgetHeadId = dto.BudgetHeadId;

            var newReceiptPath = await SaveReceiptAsync(eventId, receipt);
            if (!string.IsNullOrEmpty(newReceiptPath))
                exp.ReceiptPath = newReceiptPath;

            exp.UpdatedAt = DateTime.UtcNow;
            budget.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return exp;
        }

        public async Task<bool> DeleteExpenseAsync(int eventId, int expenseId)
        {
            var budget = await _db.Budgets.SingleOrDefaultAsync(b => b.EventId == eventId);
            if (budget == null) return false;


            var exp = await _db.Expenses.SingleOrDefaultAsync(e => e.Id == expenseId && e.BudgetId == budget.Id);
            if (exp == null) return false;


            budget.ActualAmount -= exp.Amount;
            _db.Expenses.Remove(exp);
            budget.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return true;
        }
        public async Task<IReadOnlyList<Expense>> GetExpensesAsync(int eventId)
        {
            var budget = await _db.Budgets.SingleOrDefaultAsync(b => b.EventId == eventId)
            ?? throw new KeyNotFoundException("Budget not found for event.");


            return await _db.Expenses.Where(e => e.BudgetId == budget.Id)
            .OrderByDescending(e => e.SpentOn)
            .ToListAsync();
        }
        private async Task<string?> SaveReceiptAsync(int eventId, IFormFile? file)
        {
            if (file == null || file.Length == 0) return null;
            if (file.Length > MaxReceiptBytes) throw new InvalidOperationException("Receipt file too large (max 10 MB)");


            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedReceiptExtensions.Contains(ext))
                throw new InvalidOperationException("Only .png, .jpg, .jpeg, .pdf receipts are allowed");


            var relativeDir = Path.Combine("receipts", eventId.ToString());
            var absoluteDir = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), relativeDir);
            Directory.CreateDirectory(absoluteDir);


            var fileName = $"{Guid.NewGuid()}{ext}";
            var absolutePath = Path.Combine(absoluteDir, fileName);


            using (var stream = new FileStream(absolutePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }


            // Return path relative to wwwroot for public serving
            var relativePath = Path.Combine(relativeDir, fileName).Replace('\\', '/');
            return relativePath;
        }


        private static string CombineToPublicUrl(string baseUrl, string relativePath)
        {
            if (string.IsNullOrWhiteSpace(baseUrl)) return relativePath;
            return $"{baseUrl.TrimEnd('/')}/{relativePath.TrimStart('/')}";
        }
        public async Task<BudgetHead> AddBudgetHeadAsync(int budgetId, BudgetHeadCreateDto dto)
        {
            var budget = await _db.Budgets.FindAsync(budgetId);
            if (budget == null) throw new KeyNotFoundException("Budget not found");

            var head = new BudgetHead
            {
                BudgetId = budgetId,
                Name = dto.Name,
                AllocatedAmount = dto.AllocatedAmount,
                ActualAmount = 0m
            };

            _db.BudgetHeads.Add(head);
            await _db.SaveChangesAsync();
            return head;
        }

        public async Task<BudgetHead?> UpdateBudgetHeadAsync(int headId, BudgetHeadUpdateDto dto)
        {
            var head = await _db.BudgetHeads.FindAsync(headId);
            if (head == null) return null;

            head.Name = dto.Name;
            head.AllocatedAmount = dto.AllocatedAmount;
            head.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return head;
        }

        public async Task<bool> DeleteBudgetHeadAsync(int headId)
        {
            var head = await _db.BudgetHeads.Include(h => h.Expenses).SingleOrDefaultAsync(h => h.Id == headId);
            if (head == null) return false;

            // remove expenses first
            _db.Expenses.RemoveRange(head.Expenses);
            _db.BudgetHeads.Remove(head);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<IReadOnlyList<BudgetHeadSummaryDto>> GetBudgetHeadsAsync(int budgetId)
        {
            var heads = await _db.BudgetHeads
                .Where(h => h.BudgetId == budgetId)
                .Include(h => h.Expenses)
                .ToListAsync();

            return heads.Select(h => new BudgetHeadSummaryDto
            {
                Id = h.Id,
                Name = h.Name,
                AllocatedAmount = h.AllocatedAmount,
                ActualAmount = h.Expenses.Sum(e => e.Amount)
            }).ToList();
        }

    }
}
   