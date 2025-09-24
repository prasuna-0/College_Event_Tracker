
using CET_Backend.Data;
using CET_Backend.Enums;
using CET_Backend.Interfaces;
using CET_Backend.Models.DTOs;
using CET_Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CET_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly ILogger<EventsController> _logger;

        public EventsController(IEventService eventService, ILogger<EventsController> logger)
        {
            _eventService = eventService;
            _logger = logger;
        }


        [HttpGet]
        [ProducesResponseType(typeof(APIResponse<IEnumerable<EventDTO>>), 200)]
        public async Task<ActionResult<APIResponse<IEnumerable<EventDTO>>>> GetEvents()
        {
            try
            {
                var events = await _eventService.GetAllEventsAsync();
                var response = new APIResponse<IEnumerable<EventDTO>>
                {
                    Success = true,
                    Message = "Events retrieved successfully",
                    Data = events
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving events");
                var response = new APIResponse<IEnumerable<EventDTO>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving events",
                    Errors = new List<string> { ex.Message }
                };
                return StatusCode(500, response);
            }
        }
        [HttpGet("by-date")]
        public async Task<ActionResult<APIResponse<IEnumerable<EventDTO>>>> GetEventsByDate([FromQuery] string date)
        {
            try
            {
                if (!DateTime.TryParse(date, out var selectedDate))
                {
                    return BadRequest(new APIResponse<IEnumerable<EventDTO>>
                    {
                        Success = false,
                        Message = "Invalid date format. Use YYYY-MM-DD."
                    });
                }

                var allEvents = await _eventService.GetAllEventsAsync();

                var eventsOnDate = allEvents
                    .Where(e => e.StartDate.Date <= selectedDate.Date && e.EndDate.Date >= selectedDate.Date)
                    .OrderBy(e => e.StartDate)
                    .ToList();

                return Ok(new APIResponse<IEnumerable<EventDTO>>
                {
                    Success = true,
                    Message = $"Events on {selectedDate:yyyy-MM-dd} retrieved successfully",
                    Data = eventsOnDate
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving events for date {Date}", date);
                return StatusCode(500, new APIResponse<IEnumerable<EventDTO>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving events",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(APIResponse<EventDTO>), 200)]
        [ProducesResponseType(typeof(APIResponse<EventDTO>), 404)]
        public async Task<ActionResult<APIResponse<EventDTO>>> GetEvent(int id)
        {
            try
            {
                var eventDto = await _eventService.GetEventByIdAsync(id);
                if (eventDto == null)
                {
                    var notFoundResponse = new APIResponse<EventDTO>
                    {
                        Success = false,
                        Message = $"Event with ID {id} not found"
                    };
                    return NotFound(notFoundResponse);
                }

                var response = new APIResponse<EventDTO>
                {
                    Success = true,
                    Message = "Event retrieved successfully",
                    Data = eventDto
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving event with ID {EventId}", id);
                var response = new APIResponse<EventDTO>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the event",
                    Errors = new List<string> { ex.Message }
                };
                return StatusCode(500, response);
            }
        }


        [HttpPost]
        [ProducesResponseType(typeof(APIResponse<EventDTO>), 201)]
        [ProducesResponseType(typeof(APIResponse<EventDTO>), 400)]
        public async Task<ActionResult<APIResponse<EventDTO>>> CreateEvent([FromBody] CreateEventDto createEventDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    var validationResponse = new APIResponse<EventDTO>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    };
                    return BadRequest(validationResponse);
                }

                if (createEventDto.StartDate >= createEventDto.EndDate)
                {
                    var dateValidationResponse = new APIResponse<EventDTO>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = new List<string> { "End date must be after start date" }
                    };
                    return BadRequest(dateValidationResponse);
                }

                var validationErrors = ValidateEnumValues(createEventDto.Faculty, createEventDto.EventScope, createEventDto.EventStatus);
                if (validationErrors.Any())
                {
                    var enumValidationResponse = new APIResponse<EventDTO>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = validationErrors
                    };
                    return BadRequest(enumValidationResponse);
                }

                var newEvent = await _eventService.CreateEventAsync(createEventDto);
                var response = new APIResponse<EventDTO>
                {
                    Success = true,
                    Message = "Event created successfully",
                    Data = newEvent
                };

                _logger.LogInformation("Event created with ID {EventId}", newEvent.Id);
                return CreatedAtAction(nameof(GetEvent), new { id = newEvent.Id }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating event");
                var response = new APIResponse<EventDTO>
                {
                    Success = false,
                    Message = "An error occurred while creating the event",
                    Errors = new List<string> { ex.Message }
                };
                return StatusCode(500, response);
            }
        }


        [HttpPut("{id}")]
        [ProducesResponseType(typeof(APIResponse<EventDTO>), 200)]
        [ProducesResponseType(typeof(APIResponse<EventDTO>), 400)]
        [ProducesResponseType(typeof(APIResponse<EventDTO>), 404)]
        public async Task<ActionResult<APIResponse<EventDTO>>> UpdateEvent(int id, [FromBody] UpdateEventDto updateEventDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    var validationResponse = new APIResponse<EventDTO>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    };
                    return BadRequest(validationResponse);
                }

                if (updateEventDto.StartDate >= updateEventDto.EndDate)
                {
                    var dateValidationResponse = new APIResponse<EventDTO>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = new List<string> { "End date must be after start date" }
                    };
                    return BadRequest(dateValidationResponse);
                }

                var validationErrors = ValidateEnumValues(updateEventDto.Faculty, updateEventDto.EventScope, updateEventDto.EventStatus);
                if (validationErrors.Any())
                {
                    var enumValidationResponse = new APIResponse<EventDTO>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = validationErrors
                    };
                    return BadRequest(enumValidationResponse);
                }

                var updatedEvent = await _eventService.UpdateEventAsync(id, updateEventDto);
                if (updatedEvent == null)
                {
                    var notFoundResponse = new APIResponse<EventDTO>
                    {
                        Success = false,
                        Message = $"Event with ID {id} not found"
                    };
                    return NotFound(notFoundResponse);
                }

                var response = new APIResponse<EventDTO>
                {
                    Success = true,
                    Message = "Event updated successfully",
                    Data = updatedEvent
                };

                _logger.LogInformation("Event updated with ID {EventId}", id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating event with ID {EventId}", id);
                var response = new APIResponse<EventDTO>
                {
                    Success = false,
                    Message = "An error occurred while updating the event",
                    Errors = new List<string> { ex.Message }
                };
                return StatusCode(500, response);
            }
        }


        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(APIResponse), 200)]
        [ProducesResponseType(typeof(APIResponse), 404)]
        public async Task<ActionResult<APIResponse>> DeleteEvent(int id)
        {
            try
            {
                var deleted = await _eventService.DeleteEventAsync(id);
                if (!deleted)
                {
                    var notFoundResponse = new APIResponse
                    {
                        Success = false,
                        Message = $"Event with ID {id} not found"
                    };
                    return NotFound(notFoundResponse);
                }

                var response = new APIResponse
                {
                    Success = true,
                    Message = "Event deleted successfully"
                };

                _logger.LogInformation("Event deleted with ID {EventId}", id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting event with ID {EventId}", id);
                var response = new APIResponse
                {
                    Success = false,
                    Message = "An error occurred while deleting the event",
                    Errors = new List<string> { ex.Message }
                };
                return StatusCode(500, response);
            }
        }


        [HttpGet("faculty/{faculty}")]
        public async Task<ActionResult<APIResponse<IEnumerable<EventDTO>>>> GetEventsByFaculty(string faculty)
        {
            try
            {
                IEnumerable<EventDTO> events;

                if (string.Equals(faculty, "All", StringComparison.OrdinalIgnoreCase))
                {
                    events = await _eventService.GetAllEventsAsync();
                }
                else
                {
                    events = await _eventService.GetEventsByFacultyAsync(faculty);
                }

                var response = new APIResponse<IEnumerable<EventDTO>>
                {
                    Success = true,
                    Message = $"Events for faculty {faculty} retrieved successfully",
                    Data = events
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving events for faculty {Faculty}", faculty);
                var response = new APIResponse<IEnumerable<EventDTO>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving events",
                    Errors = new List<string> { ex.Message }
                };
                return StatusCode(500, response);
            }
        }


        [HttpGet("scope/{scope}")]
        [ProducesResponseType(typeof(APIResponse<IEnumerable<EventDTO>>), 200)]
        public async Task<ActionResult<APIResponse<IEnumerable<EventDTO>>>> GetEventsByScope(string scope)
        {
            try
            {
                var events = await _eventService.GetEventsByScopeAsync(scope);
                var response = new APIResponse<IEnumerable<EventDTO>>
                {
                    Success = true,
                    Message = $"Events for scope {scope} retrieved successfully",
                    Data = events
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving events for scope {Scope}", scope);
                var response = new APIResponse<IEnumerable<EventDTO>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving events",
                    Errors = new List<string> { ex.Message }
                };
                return StatusCode(500, response);
            }
        }


        [HttpGet("status/{status}")]
        [ProducesResponseType(typeof(APIResponse<IEnumerable<EventDTO>>), 200)]
        public async Task<ActionResult<APIResponse<IEnumerable<EventDTO>>>> GetEventsByStatus(string status)
        {
            try
            {
                IEnumerable<EventDTO> events;

                if (string.Equals(status, "Upcoming", StringComparison.OrdinalIgnoreCase))
                {
                    events = await _eventService.GetUpcomingEventsAsync();
                }
                else
                {
                    events = await _eventService.GetEventsByStatusAsync(status);
                }

                var response = new APIResponse<IEnumerable<EventDTO>>
                {
                    Success = true,
                    Message = $"Events with status {status} retrieved successfully",
                    Data = events
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving events for status {Status}", status);
                var response = new APIResponse<IEnumerable<EventDTO>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving events",
                    Errors = new List<string> { ex.Message }
                };
                return StatusCode(500, response);
            }
        }


        [HttpGet("upcoming")]
        [ProducesResponseType(typeof(APIResponse<IEnumerable<EventDTO>>), 200)]
        public async Task<ActionResult<APIResponse<IEnumerable<EventDTO>>>> GetUpcomingEvents()
        {
            try
            {
                var events = await _eventService.GetUpcomingEventsAsync();
                var response = new APIResponse<IEnumerable<EventDTO>>
                {
                    Success = true,
                    Message = "Upcoming events retrieved successfully",
                    Data = events
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving upcoming events");
                var response = new APIResponse<IEnumerable<EventDTO>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving upcoming events",
                    Errors = new List<string> { ex.Message }
                };
                return StatusCode(500, response);
            }
        }

        private static List<string> ValidateEnumValues(string faculty, string eventScope, string eventStatus)
        {
            var errors = new List<string>();

            var validFaculties = new[] { "All", "BIM", "BSCCSIT", "BHM", "BBS", "BCA" };
            if (!validFaculties.Contains(faculty, StringComparer.OrdinalIgnoreCase))
            {
                errors.Add("Invalid faculty. Must be one of: All, BIM, BSCCSIT, BHM, BBS, BCA");
            }

            var validScopes = new[] { "Intercollege", "Collegelevel", "Facultylevel" };
            if (!validScopes.Contains(eventScope, StringComparer.OrdinalIgnoreCase))
            {
                errors.Add("Invalid event scope. Must be one of: Intercollege, Collegelevel, Facultylevel");
            }

            var validStatuses = new[] { "Upcoming", "Planned", "Active", "Completed", "Cancelled" };
            if (!validStatuses.Contains(eventStatus, StringComparer.OrdinalIgnoreCase))
            {
                errors.Add("Invalid event status. Must be one of: Upcoming, Planned, Active, Completed, Cancelled");
            }

            return errors;
        }
        [HttpPost("{eventId}/assign-team/{teamId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignTeam(int eventId, int teamId)
        {
            try
            {
                var result = await _eventService.AssignTeamAsync(eventId, teamId);
                if (!result)
                    return NotFound(new { Message = "Event or Team not found" });

                return Ok(new { Message = "Team assigned successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
        [HttpDelete("{eventId}/unassign-team")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UnassignTeam(int eventId)
        {
            try
            {
                var result = await _eventService.UnassignTeamAsync(eventId);
                if (!result)
                    return NotFound(new { Message = "Event not found or no team assigned" });

                return Ok(new { Message = "Team unassigned successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
        [HttpPost("{eventId}/register")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> RegisterForEvent(int eventId)
        {
            var studentId = int.Parse(User.FindFirstValue("StudentId"));
            // assuming JWT contains StudentId
            var result = await _eventService.RegisterStudentAsync(eventId, studentId);

            if (!result)
                return BadRequest(new { Message = "Already registered or event not found" });

            return Ok(new { Message = "Registered successfully" });
        }

        [HttpDelete("{eventId}/unregister")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> CancelRegistration(int eventId)
        {
            var studentId = int.Parse(User.FindFirstValue("StudentId"));
            var result = await _eventService.CancelRegistrationAsync(eventId, studentId);

            if (!result)
                return BadRequest(new { Message = "Cannot cancel registration (maybe within 1 week or not registered)" });

            return Ok(new { Message = "Registration cancelled successfully" });
        }

        [HttpGet("my-registrations")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetMyRegistrations()
        {
            var studentId = int.Parse(User.FindFirstValue("StudentId"));
            var events = await _eventService.GetRegisteredEventsAsync(studentId);
            return Ok(events);
        }

    }
}


