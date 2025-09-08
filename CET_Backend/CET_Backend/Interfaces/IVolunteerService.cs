using CET_Backend.Entities;
using CET_Backend.Enums;

namespace CET_Backend.Interfaces
{
    public interface IVolunteerService
    {
        // CRUD
        Task<IEnumerable<Volunteer>> GetAllVolunteersAsync();
        Task<Volunteer?> GetVolunteerByIdAsync(int id);
        Task<Volunteer> CreateVolunteerAsync(int studentId);
         Task<Volunteer?> UpdateVolunteerAsync(int id, int studentId, string? newName = null);
        Task<bool> DeleteVolunteerAsync(int id);

        // Event assignments
        Task AssignToEventAsync(int volunteerId, int eventId, string role);
        Task UnassignFromEventAsync(int volunteerId, int eventId);

        // Team assignments
        Task AssignToTeamAsync(int volunteerId, int teamId, TeamRole role);
        Task UnassignFromTeamAsync(int volunteerId, int teamId);
    }
}




