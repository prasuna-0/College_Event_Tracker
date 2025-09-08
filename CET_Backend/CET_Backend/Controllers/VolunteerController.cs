using CET_Backend.Entities;
using CET_Backend.Enums;
using CET_Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CET_Backend.Models.DTOs;
namespace CET_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VolunteerController : ControllerBase
    {
        private readonly IVolunteerService _volunteerService;

        public VolunteerController(IVolunteerService volunteerService)
        {
            _volunteerService = volunteerService;
        }

        // DTOs
        //public class VolunteerCreateDTO { public int StudentId { get; set; } }
        //public class VolunteerUpdateDTO { public int StudentId { get; set; } }

        // ========================
        // GET
        // ========================
        [HttpGet]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> GetAll()
        {
            var volunteers = await _volunteerService.GetAllVolunteersAsync();
            return Ok(volunteers);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Coordinator")]
        public async Task<IActionResult> GetById(int id)
        {
            var volunteer = await _volunteerService.GetVolunteerByIdAsync(id);
            if (volunteer == null) return NotFound(new { Message = "Volunteer not found." });
            return Ok(volunteer);
        }

        // ========================
        // CREATE
        // ========================
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] VolunteerCreateDTO dto)
        {
            try
            {
                var volunteer = await _volunteerService.CreateVolunteerAsync(dto.StudentId);
                return Ok(volunteer);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // ========================
        // UPDATE
        // ========================
        //[HttpPut("{id}")]
        //[Authorize(Roles = "Admin")]
        //public async Task<IActionResult> Update(int id, [FromBody] VolunteerUpdateDTO dto)
        //{
        //    try
        //    {
        //        var volunteer = await _volunteerService.UpdateVolunteerAsync(id, dto.StudentId);
        //        if (volunteer == null) return NotFound(new { Message = "Volunteer not found." });
        //        return Ok(volunteer);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { Error = ex.Message });
        //    }
        //}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] VolunteerUpdateDTO dto)
        {
            try
            {
                var volunteer = await _volunteerService.UpdateVolunteerAsync(id, dto.StudentId, dto.Name);
                if (volunteer == null) return NotFound(new { Message = "Volunteer not found." });
                return Ok(volunteer);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }


        // ========================
        // DELETE
        // ========================
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _volunteerService.DeleteVolunteerAsync(id);
            if (!result) return NotFound(new { Message = "Volunteer not found." });
            return NoContent();
        }

        // ========================
        // Assign / Unassign Event
        // ========================
        [HttpPost("{volunteerId}/assign-event/{eventId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignEvent(int volunteerId, int eventId, [FromQuery] string role = "Member")
        {
            try
            {
                await _volunteerService.AssignToEventAsync(volunteerId, eventId, role);
                return Ok(new { Message = "Volunteer assigned to event successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("{volunteerId}/unassign-event/{eventId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UnassignEvent(int volunteerId, int eventId)
        {
            try
            {
                await _volunteerService.UnassignFromEventAsync(volunteerId, eventId);
                return Ok(new { Message = "Volunteer unassigned from event successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // ========================
        // Assign / Unassign Team
        // ========================
        [HttpPost("{volunteerId}/assign-team/{teamId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignTeam(int volunteerId, int teamId, [FromQuery] TeamRole role = TeamRole.Member)
        {
            try
            {
                await _volunteerService.AssignToTeamAsync(volunteerId, teamId, role);
                return Ok(new { Message = "Volunteer assigned to team successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("{volunteerId}/unassign-team/{teamId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UnassignTeam(int volunteerId, int teamId)
        {
            try
            {
                await _volunteerService.UnassignFromTeamAsync(volunteerId, teamId);
                return Ok(new { Message = "Volunteer unassigned from team successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}











