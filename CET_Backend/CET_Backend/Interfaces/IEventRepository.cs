using CET_Backend.Entities;
using CET_Backend.Enums;

namespace CET_Backend.Interfaces
{
    public interface IEventRepository
    {
        Task<IEnumerable<Event>> GetAllAsync();
        Task<Event?> GetByIdAsync(int id);
        Task<Event> CreateAsync(Event eventEntity);
        Task<Event?> UpdateAsync(Event eventEntity);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Event>> GetByFacultyAsync(Faculty faculty);
        Task<IEnumerable<Event>> GetByScopeAsync(EventScope scope);
        Task<IEnumerable<Event>> GetByStatusAsync(EventStatus status);
        Task<IEnumerable<Event>> GetUpcomingAsync();
        Task<IEnumerable<Event>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<bool> ExistsAsync(int id);
    }
}
