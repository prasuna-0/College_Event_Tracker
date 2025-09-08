

//using CET_Backend.Interfaces;
//using CET_Backend.Models.DTOs;
//using CET_Backend.Models;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Authorization;
//using CET_Backend.DTOs;
//using CET_Backend.Services;

//namespace CET_Backend.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class BudgetController : ControllerBase
//    {
//        private readonly IBudgetService _service;

//        public BudgetController(IBudgetService service)
//        {
//            _service = service;
//        }

//        // =========================
//        // Budget endpoints
//        // =========================

//        [HttpPost("allocate")]
//        [Authorize(Roles = "Admin")]
//        public async Task<IActionResult> Allocate([FromBody] BudgetAllocateDto dto)
//        {
//            var budget = await _service.AllocateAsync(dto);
//            return CreatedAtAction(nameof(GetByEvent), new { eventId = dto.EventId }, budget);
//        }

//        [HttpPut("{eventId:int}")]
//        [Authorize(Roles = "Admin,Coordinator")]
//        public async Task<IActionResult> UpdateBudget(int eventId, [FromBody] BudgetUpdateDto dto)
//        {
//            var updated = await _service.UpdateAsync(eventId, dto);
//            return Ok(updated);
//        }

//        [HttpDelete("{budgetId:int}")]
//        [Authorize(Roles = "Admin")]
//        public async Task<IActionResult> DeleteBudget(int budgetId)
//        {
//            var ok = await _service.DeleteBudgetAsync(budgetId);
//            return ok ? NoContent() : NotFound();
//        }

//        [HttpGet("{eventId:int}")]
//        [Authorize(Roles = "Admin,Coordinator")]
//        public async Task<IActionResult> GetByEvent(int eventId)
//        {
//            var budget = await _service.GetByEventIdAsync(eventId);
//            if (budget == null) return NotFound();
//            return Ok(budget);
//        }


//        [HttpGet("{eventId:int}/summary")]
//        [Authorize(Roles = "Admin,Coordinator")]
//        public async Task<IActionResult> GetSummary(int eventId)
//        {
//            var baseUrl = $"{Request.Scheme}://{Request.Host.Value}";
//            var summary = await _service.GetSummaryAsync(eventId, baseUrl);
//            if (summary == null) return NotFound();
//            return Ok(summary); // DTO returned, safe for JSON
//        }

//        // =========================
//        // Expense endpoints
//        // =========================

//        [HttpGet("{eventId:int}/expenses")]
//        [Authorize(Roles = "Admin,Coordinator")]
//        public async Task<IActionResult> GetExpenses(int eventId)
//        {
//            var expenses = await _service.GetExpensesAsync(eventId);
//            return Ok(expenses);
//        }

//        //[HttpPost("{eventId:int}/expenses")]
//        //[Authorize(Roles = "Admin")]
//        //[RequestSizeLimit(20_000_000)]
//        //public async Task<IActionResult> AddExpense(int eventId, [FromForm] ExpenseCreateDto dto, IFormFile? receipt)
//        //{
//        //    var exp = await _service.AddExpenseAsync(eventId, dto, receipt);
//        //    return Ok(exp);
//        //}
//        [HttpPost("{eventId:int}/expenses")]
//        [Authorize(Roles = "Admin")]
//        [RequestSizeLimit(20_000_000)] // 20 MB
//        public async Task<IActionResult> AddExpense(int eventId, [FromForm] ExpenseCreateDto dto, IFormFile? receipt)
//        {
//            try
//            {
//                // Construct base URL from the current HTTP request
//                var baseUrl = $"{Request.Scheme}://{Request.Host.Value}";

//                // Pass baseUrl to the service method
//                var expense = await _service.AddExpenseAsync(eventId, dto, receipt, baseUrl);

//                return Ok(expense);
//            }
//            catch (KeyNotFoundException ex)
//            {
//                return NotFound(new { success = false, message = ex.Message });
//            }
//            catch (InvalidOperationException ex)
//            {
//                return BadRequest(new { success = false, message = ex.Message });
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(StatusCodes.Status500InternalServerError,
//                    new { success = false, message = "Internal server error", details = ex.Message });
//            }
//        }


//        [HttpPut("{eventId:int}/expenses/{expenseId:int}")]
//        [Authorize(Roles = "Admin,Coordinator")]
//        [RequestSizeLimit(20_000_000)]
//        public async Task<IActionResult> UpdateExpense(int eventId, int expenseId, [FromForm] ExpenseUpdateDto dto, IFormFile? receipt)
//        {
//            var exp = await _service.UpdateExpenseAsync(eventId, expenseId, dto, receipt);
//            if (exp == null) return NotFound();
//            return Ok(exp);
//        }

//        [HttpDelete("{eventId:int}/expenses/{expenseId:int}")]
//        [Authorize(Roles = "Admin")]
//        public async Task<IActionResult> DeleteExpense(int eventId, int expenseId)
//        {
//            var ok = await _service.DeleteExpenseAsync(eventId, expenseId);
//            return ok ? NoContent() : NotFound();
//        }

//        // =========================
//        // Budget Head endpoints
//        // =========================

//        [HttpPost("{budgetId:int}/heads")]
//        [Authorize(Roles = "Admin")]
//        public async Task<IActionResult> AddHead(int budgetId, [FromBody] BudgetHeadCreateDto dto)
//        {
//            var head = await _service.AddBudgetHeadAsync(budgetId, dto);
//            return CreatedAtAction(nameof(GetHeads), new { budgetId = budgetId }, head);
//        }

//        [HttpPut("heads/{headId:int}")]
//        [Authorize(Roles = "Admin,Coordinator")]
//        public async Task<IActionResult> UpdateHead(int headId, [FromBody] BudgetHeadUpdateDto dto)
//        {
//            var updated = await _service.UpdateBudgetHeadAsync(headId, dto);
//            if (updated == null) return NotFound();
//            return Ok(updated);
//        }

//        [HttpDelete("heads/{headId:int}")]
//        [Authorize(Roles = "Admin")]
//        public async Task<IActionResult> DeleteHead(int headId)
//        {
//            var ok = await _service.DeleteBudgetHeadAsync(headId);
//            return ok ? NoContent() : NotFound();
//        }

//        [HttpGet("{budgetId:int}/heads")]
//        [Authorize(Roles = "Admin,Coordinator")]
//        public async Task<IActionResult> GetHeads(int budgetId)
//        {
//            var heads = await _service.GetBudgetHeadsAsync(budgetId);
//            return Ok(heads);
//        }
//    }
//}

using CET_Backend.Interfaces;
using CET_Backend.Models.DTOs;
using CET_Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CET_Backend.DTOs;
using CET_Backend.Services;

namespace CET_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        private readonly IBudgetService _service;

        public BudgetController(IBudgetService service)
        {
            _service = service;
        }

        // =========================
        // Budget endpoints
        // =========================
        [HttpGet]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> GetAllBudgets()
        {
            var budgets = await _service.GetAllBudgetsAsync();
            return Ok(new { success = true, data = budgets });
        }


        [HttpPost("allocate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Allocate([FromBody] BudgetAllocateDto dto)
        {
            if (dto.EstimatedAmount <= 0)
                return BadRequest(new { success = false, message = "Estimated amount must be positive" });

            try
            {
                var budget = await _service.AllocateAsync(dto);
                return Ok(new { success = true, message = "Budget allocated successfully", data = budget });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { success = false, message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPut("{eventId:int}")]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> UpdateBudget(int eventId, [FromBody] BudgetUpdateDto dto)
        {
            try
            {
                var updated = await _service.UpdateAsync(eventId, dto);
                return Ok(new { success = true, message = "Budget updated successfully", data = updated });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Internal server error", details = ex.Message });
            }
        }

        [HttpDelete("{budgetId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBudget(int budgetId)
        {
            var ok = await _service.DeleteBudgetAsync(budgetId);
            return ok ? NoContent() : NotFound(new { success = false, message = "Budget not found" });
        }

        [HttpGet("{eventId:int}")]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> GetByEvent(int eventId)
        {
            var budget = await _service.GetByEventIdAsync(eventId);
            if (budget == null) return NotFound(new { success = false, message = "Budget not found" });
            return Ok(new { success = true, data = budget });
        }

        [HttpGet("{eventId:int}/summary")]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> GetSummary(int eventId)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host.Value}";
            var summary = await _service.GetSummaryAsync(eventId, baseUrl);
            if (summary == null) return NotFound(new { success = false, message = "Budget summary not found" });
            return Ok(new { success = true, data = summary });
        }

        // =========================
        // Dropdown events endpoint
        // =========================
        [HttpGet("dropdown-events")]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> GetEvents()
        {
            try
            {
                var events = await _service.GetAllEventsAsync(); // should return Id + Title
                return Ok(new { success = true, message = "Events retrieved successfully", data = events });
            }
            catch
            {
                return StatusCode(500, new { success = false, message = "Error fetching events" });
            }
        }
        [HttpGet("events")]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _service.GetAllEventsAsync();
            return Ok(new { success = true, message = "Events retrieved successfully", data = events });
        }


        // =========================
        // Expense endpoints
        // =========================

        [HttpGet("{eventId:int}/expenses")]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> GetExpenses(int eventId)
        {
            try
            {
                var expenses = await _service.GetExpensesAsync(eventId);
                return Ok(new { success = true, data = expenses });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error fetching expenses", details = ex.Message });
            }
        }

        [HttpPost("{eventId:int}/expenses")]
        [Authorize(Roles = "Admin")]
        [RequestSizeLimit(20_000_000)]
        public async Task<IActionResult> AddExpense(int eventId, [FromForm] ExpenseCreateDto dto, IFormFile? receipt)
        {
            try
            {
                var baseUrl = $"{Request.Scheme}://{Request.Host.Value}";
                var expense = await _service.AddExpenseAsync(eventId, dto, receipt, baseUrl);
                return Ok(new { success = true, message = "Expense added successfully", data = expense });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Internal server error", details = ex.Message });
            }
        }

        // PUT/DELETE and BudgetHead endpoints can also be wrapped similarly with try/catch + consistent JSON responses
        [HttpPost("{budgetId:int}/heads")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddHead(int budgetId, [FromBody] BudgetHeadCreateDto dto)
        {
            var head = await _service.AddBudgetHeadAsync(budgetId, dto);
            return CreatedAtAction(nameof(GetHeads), new { budgetId = budgetId }, head);
        }

        [HttpPut("heads/{headId:int}")]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> UpdateHead(int headId, [FromBody] BudgetHeadUpdateDto dto)
        {
            var updated = await _service.UpdateBudgetHeadAsync(headId, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("heads/{headId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteHead(int headId)
        {
            var ok = await _service.DeleteBudgetHeadAsync(headId);
            return ok ? NoContent() : NotFound();
        }

        [HttpGet("{budgetId:int}/heads")]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> GetHeads(int budgetId)
        {
            var heads = await _service.GetBudgetHeadsAsync(budgetId);
            return Ok(heads);
        }
    }
}
