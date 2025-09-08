using CET_Backend.Data;
using CET_Backend.Entities;
using CET_Backend.Enums;
using CET_Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CET_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ITeamService _teamService;

        public TeamController(AppDbContext context, ITeamService teamService)
        {
            _context = context;
            _teamService = teamService;
        }
  
        // GET: api/Team
        [HttpGet]
        [Authorize(Roles = "Admin,Coordinator")] // Admin and Coordinator can read
        public async Task<IActionResult> GetAll()
        {
            var teams = await _teamService.GetAllTeamsAsync();
            return Ok(teams);
        }
        [HttpGet("{teamId}/members")]
        public async Task<IActionResult> GetTeamMembers(int teamId)
        {
            var team = await _context.Teams
                .Include(t => t.Members) // Members navigation property
                .FirstOrDefaultAsync(t => t.Id == teamId);

            if (team == null) return NotFound();

            var members = team.Members.Select(m => new { m.Id, m.Username }).ToList();
            return Ok(members);
        }

        // GET: api/Team/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> GetById(int id)
        {
            var team = await _teamService.GetTeamByIdAsync(id);
            if (team == null) return NotFound();
            return Ok(team);
        }

        // POST: api/Team
        [HttpPost]
        [Authorize(Roles = "Admin")] // Only Admin can create
        public async Task<IActionResult> Create([FromBody] Team team)
        {
            var created = await _teamService.CreateTeamAsync(team);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT: api/Team/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] Team team)
        {
            var updated = await _teamService.UpdateTeamAsync(id, team);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE: api/Team/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _teamService.DeleteTeamAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // POST: api/Team/assign-volunteer
        [HttpPost("assign-volunteer")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignVolunteer(int volunteerId, int teamId, TeamRole role)
        {
            await _teamService.AssignVolunteerAsync(volunteerId, teamId, role);
            return Ok(new { message = $"Volunteer {volunteerId} assigned to team {teamId} as {role}" });
        }

        // POST: api/Team/unassign-volunteer
        [HttpPost("unassign-volunteer")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UnassignVolunteer(int volunteerId, int teamId)
        {
            await _teamService.UnassignVolunteerAsync(volunteerId, teamId);
            return Ok(new { message = $"Volunteer {volunteerId} unassigned from team {teamId}" });
        }
    }
}


