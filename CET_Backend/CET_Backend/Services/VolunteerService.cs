
using CET_Backend.Data;
using CET_Backend.Entities;
using CET_Backend.Enums;
using CET_Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CET_Backend.Services
{
    public class VolunteerService : IVolunteerService
    {
        private readonly AppDbContext _context;

        public VolunteerService(AppDbContext context)
        {
            _context = context;
        }

      
        public async Task<IEnumerable<Volunteer>> GetAllVolunteersAsync()
        {
            return await _context.Volunteers
                .Include(v => v.Student)
                    .ThenInclude(s => s.User)
                .Include(v => v.EventVolunteers)
                    .ThenInclude(ev => ev.Event)
                .Include(v => v.TeamVolunteers)
                    .ThenInclude(tv => tv.Team)
                .ToListAsync();
        }

        public async Task<Volunteer?> GetVolunteerByIdAsync(int id)
        {
            return await _context.Volunteers
                .Include(v => v.Student)
                    .ThenInclude(s => s.User)
                .Include(v => v.EventVolunteers)
                    .ThenInclude(ev => ev.Event)
                .Include(v => v.TeamVolunteers)
                    .ThenInclude(tv => tv.Team)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<Volunteer> CreateVolunteerAsync(int studentId)
        {
            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.SID == studentId);

            if (student == null)
                throw new Exception("Student not found.");

            var volunteer = new Volunteer
            {
                SID = student.SID,
                Student = student,
                Name = student.User?.Username ?? "",
                Email = student.User?.Email ?? ""
            };

            _context.Volunteers.Add(volunteer);
            await _context.SaveChangesAsync();
            return volunteer;
        }

       
        public async Task<Volunteer?> UpdateVolunteerAsync(int id, int studentId, string? newName = null)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);
            if (volunteer == null) return null;

            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.SID == studentId);

            if (student == null)
                throw new Exception("Student not found.");

            volunteer.SID = student.SID;
            volunteer.Student = student;

            if (!string.IsNullOrEmpty(newName))
                volunteer.Name = newName;
            else
                volunteer.Name = student.User?.Username ?? "";

            volunteer.Email = student.User?.Email ?? "";

            await _context.SaveChangesAsync();
            return volunteer;
        }



        public async Task<bool> DeleteVolunteerAsync(int id)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);
            if (volunteer == null) return false;

            _context.Volunteers.Remove(volunteer);
            await _context.SaveChangesAsync();
            return true;
        }

      
        public async Task AssignToEventAsync(int volunteerId, int eventId, string role)
        {
            var volunteer = await _context.Volunteers.FindAsync(volunteerId);
            var evt = await _context.Events.FindAsync(eventId);
            if (volunteer == null || evt == null)
                throw new Exception("Volunteer or Event not found.");

            if (!await _context.EventVolunteers.AnyAsync(ev => ev.VolunteerId == volunteerId && ev.EventId == eventId))
            {
                _context.EventVolunteers.Add(new EventVolunteer
                {
                    VolunteerId = volunteerId,
                    EventId = eventId,
                    Role = role
                });
                await _context.SaveChangesAsync();
            }
        }

        public async Task UnassignFromEventAsync(int volunteerId, int eventId)
        {
            var ev = await _context.EventVolunteers
                .FirstOrDefaultAsync(e => e.VolunteerId == volunteerId && e.EventId == eventId);

            if (ev != null)
            {
                _context.EventVolunteers.Remove(ev);
                await _context.SaveChangesAsync();
            }
        }

        
        public async Task AssignToTeamAsync(int volunteerId, int teamId, TeamRole role)
        {
            var volunteer = await _context.Volunteers.FindAsync(volunteerId);
            var team = await _context.Teams.FindAsync(teamId);
            if (volunteer == null || team == null)
                throw new Exception("Volunteer or Team not found.");

            if (!await _context.TeamVolunteers.AnyAsync(tv => tv.VolunteerId == volunteerId && tv.TeamId == teamId))
            {
                _context.TeamVolunteers.Add(new TeamVolunteer
                {
                    VolunteerId = volunteerId,
                    TeamId = teamId,
                    Role = role
                });
                await _context.SaveChangesAsync();
            }
        }

        public async Task UnassignFromTeamAsync(int volunteerId, int teamId)
        {
            var tv = await _context.TeamVolunteers
                .FirstOrDefaultAsync(t => t.VolunteerId == volunteerId && t.TeamId == teamId);

            if (tv != null)
            {
                _context.TeamVolunteers.Remove(tv);
                await _context.SaveChangesAsync();
            }
        }
    }
}









