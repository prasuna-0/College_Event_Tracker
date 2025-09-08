using CET_Backend.Entities;
using CET_Backend.Enums;
using CET_Backend.Interfaces;
using CET_Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace CET_Backend.Services
{
    public class TeamService : ITeamService
    {
        private readonly AppDbContext _context;

        public TeamService(AppDbContext context)
        {
            _context = context;
        }

        // CRUD
        public async Task<IEnumerable<Team>> GetAllTeamsAsync()
        {
            return await _context.Teams.Include(t => t.TeamVolunteers).ThenInclude(tv => tv.Volunteer).ToListAsync();
        }

        public async Task<Team?> GetTeamByIdAsync(int id)
        {
            return await _context.Teams.Include(t => t.TeamVolunteers).ThenInclude(tv => tv.Volunteer)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Team> CreateTeamAsync(Team team)
        {
            _context.Teams.Add(team);
            await _context.SaveChangesAsync();
            return team;
        }

        public async Task<Team?> UpdateTeamAsync(int id, Team updatedTeam)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null) return null;

            team.Name = updatedTeam.Name;
            await _context.SaveChangesAsync();
            return team;
        }

        public async Task<bool> DeleteTeamAsync(int id)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null) return false;

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();
            return true;
        }

        // Assign/Unassign
        public async Task AssignVolunteerAsync(int teamId, int volunteerId, TeamRole role)
        {
            var team = await _context.Teams.Include(t => t.TeamVolunteers).FirstOrDefaultAsync(t => t.Id == teamId);
            var volunteer = await _context.Volunteers.FindAsync(volunteerId);
            if (team == null || volunteer == null) throw new Exception("Team or Volunteer not found");

            if (team.TeamVolunteers.Any(tv => tv.VolunteerId == volunteerId))
                throw new Exception("Volunteer already assigned to this team");

            team.TeamVolunteers.Add(new TeamVolunteer
            {
                TeamId = teamId,
                VolunteerId = volunteerId,
                Role = role
            });

            await _context.SaveChangesAsync();
        }

        public async Task UnassignVolunteerAsync(int teamId, int volunteerId)
        {
            var teamVolunteer = await _context.TeamVolunteers
                .FirstOrDefaultAsync(tv => tv.TeamId == teamId && tv.VolunteerId == volunteerId);

            if (teamVolunteer == null) throw new Exception("Volunteer not assigned to this team");

            _context.TeamVolunteers.Remove(teamVolunteer);
            await _context.SaveChangesAsync();
        }
    }
}


