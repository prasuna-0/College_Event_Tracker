using CET_Backend.Entities;
using CET_Backend.Models.DTOs;

namespace CET_Backend.Interfaces
{
    public interface IEventService
    {
        Task<bool> RegisterStudentAsync(int eventId, int studentId);
        Task<bool> CancelRegistrationAsync(int eventId, int studentId);
        Task<IEnumerable<EventDTO>> GetRegisteredEventsAsync(int studentId);
        Task<IEnumerable<EventDTO>> GetAllEventsAsync();
        Task<EventDTO?> GetEventByIdAsync(int id);
        Task<EventDTO> CreateEventAsync(CreateEventDto createEventDto);
        Task<EventDTO?> UpdateEventAsync(int id, UpdateEventDto updateEventDto);
        Task<bool> DeleteEventAsync(int id);
        Task<IEnumerable<EventDTO>> GetEventsByFacultyAsync(string faculty);
        Task<IEnumerable<EventDTO>> GetEventsByScopeAsync(string scope);
        Task<IEnumerable<EventDTO>> GetEventsByStatusAsync(string status);
        Task<IEnumerable<EventDTO>> GetUpcomingEventsAsync();
        Task<IEnumerable<EventDTO>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate);
     
        Task<bool> AssignTeamAsync(int eventId, int teamId);
        Task<bool> UnassignTeamAsync(int eventId);
    }
}
