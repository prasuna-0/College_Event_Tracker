using CET_Backend.Entities;
using CET_Backend.Enums;

namespace CET_Backend.Interfaces
{
    public interface ITeamService
    {
        Task<IEnumerable<Team>> GetAllTeamsAsync();
        Task<Team?> GetTeamByIdAsync(int id);
        Task<Team> CreateTeamAsync(Team team);
        Task<Team?> UpdateTeamAsync(int id, Team updatedTeam);
        Task<bool> DeleteTeamAsync(int id);

        Task AssignVolunteerAsync(int teamId, int volunteerId, TeamRole role);
        Task UnassignVolunteerAsync(int teamId, int volunteerId);
    }
}
