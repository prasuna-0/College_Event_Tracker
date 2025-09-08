using CET_Backend.Data;
using CET_Backend.Entities;
using CET_Backend.Enums;
using CET_Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CET_Backend.Services
{
    public class EventRepository : IEventRepository
    {
        private readonly AppDbContext _context;
        private readonly ILogger<EventRepository> _logger;

        public EventRepository(AppDbContext context, ILogger<EventRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Event>> GetAllAsync()
        {
            try
            {
                return await _context.Events
                    .OrderByDescending(e => e.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all events from database");
                throw;
            }
        }

        public async Task<Event?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Events
                    .FirstOrDefaultAsync(e => e.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving event with ID {EventId} from database", id);
                throw;
            }
        }

        public async Task<Event> CreateAsync(Event eventEntity)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                eventEntity.CreatedAt = DateTime.UtcNow;
                eventEntity.UpdatedAt = DateTime.UtcNow;

                _context.Events.Add(eventEntity);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Event created successfully with ID {EventId}", eventEntity.Id);
                return eventEntity;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error creating event in database");
                throw;
            }
        }

        public async Task<Event?> UpdateAsync(Event eventEntity)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var existingEvent = await _context.Events.FirstOrDefaultAsync(e => e.Id == eventEntity.Id);
                if (existingEvent == null)
                {
                    return null;
                }

                existingEvent.Title = eventEntity.Title;
                existingEvent.Description = eventEntity.Description;
                existingEvent.StartDate = eventEntity.StartDate;
                existingEvent.EndDate = eventEntity.EndDate;
                existingEvent.EventStatus = eventEntity.EventStatus;
                existingEvent.Location = eventEntity.Location;
                existingEvent.Faculty = eventEntity.Faculty;
                existingEvent.EventScope = eventEntity.EventScope;
                existingEvent.EventType = eventEntity.EventType;
                existingEvent.Objective = eventEntity.Objective;
                existingEvent.UpdatedAt = DateTime.UtcNow;

                _context.Events.Update(existingEvent);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Event updated successfully with ID {EventId}", eventEntity.Id);
                return existingEvent;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error updating event with ID {EventId} in database", eventEntity.Id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.Id == id);
                if (eventEntity == null)
                {
                    return false;
                }

                _context.Events.Remove(eventEntity);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Event deleted successfully with ID {EventId}", id);
                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error deleting event with ID {EventId} from database", id);
                throw;
            }
        }

        public async Task<IEnumerable<Event>> GetByFacultyAsync(Faculty faculty)
        {
            try
            {
                return await _context.Events
                    .Where(e => e.Faculty == faculty)
                    .OrderByDescending(e => e.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving events for faculty {Faculty} from database", faculty);
                throw;
            }
        }

        public async Task<IEnumerable<Event>> GetByScopeAsync(EventScope scope)
        {
            try
            {
                return await _context.Events
                    .Where(e => e.EventScope == scope)
                    .OrderByDescending(e => e.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving events for scope {Scope} from database", scope);
                throw;
            }
        }

        public async Task<IEnumerable<Event>> GetByStatusAsync(EventStatus status)
        {
            try
            {
                return await _context.Events
                    .Where(e => e.EventStatus == status)
                    .OrderByDescending(e => e.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving events for status {Status} from database", status);
                throw;
            }
        }

        public async Task<IEnumerable<Event>> GetUpcomingAsync()
        {
            try
            {
                var currentDate = DateTime.UtcNow;
                return await _context.Events
                    .Where(e => e.StartDate > currentDate)
                    .OrderBy(e => e.StartDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving upcoming events from database");
                throw;
            }
        }

        public async Task<IEnumerable<Event>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            try
            {
                return await _context.Events
                    .Where(e => e.StartDate >= startDate && e.EndDate <= endDate)
                    .OrderBy(e => e.StartDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving events for date range {StartDate} to {EndDate} from database", startDate, endDate);
                throw;
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            try
            {
                return await _context.Events.AnyAsync(e => e.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if event exists with ID {EventId}", id);
                throw;
            }
        }
    }
}
