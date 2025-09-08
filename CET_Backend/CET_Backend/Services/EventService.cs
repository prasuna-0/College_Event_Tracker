using CET_Backend.Data;
using CET_Backend.Entities;
using CET_Backend.Enums;
using CET_Backend.Interfaces;
using CET_Backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CET_Backend.Services
{
    public class EventService : IEventService
    {
        private readonly AppDbContext _context;
        private readonly IEventRepository _eventRepository;
        private readonly INotificationService _notificationService;
        private readonly ILogger<EventService> _logger;

        public EventService(AppDbContext context, IEventRepository eventRepository, INotificationService notificationService, ILogger<EventService> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _eventRepository = eventRepository;
            _notificationService = notificationService;
            _logger = logger;
        }
        public async Task UpdateEventStatusAsync(int eventId, string newStatus, int adminId)
        {
            var ev = await _eventRepository.GetByIdAsync(eventId);
            if (ev == null) throw new Exception("Event not found");

            ev.EventStatus = Enum.Parse<EventStatus>(newStatus, true);
            await _eventRepository.UpdateAsync(ev);

            // Notify all coordinators
            var coordinators = await _notificationService.GetUsersByRoleAsync("Coordinator");
            var notification = new Notification
            {
                EventId = ev.Id,
                Title = "Event Status Update",
                Message = $"Event '{ev.Title}' status changed to {newStatus}.",
                CreatedAt = DateTime.UtcNow
            };

            var coordinatorIds = coordinators.Select(c => c.Id).ToList();
            await _notificationService.CreateNotificationAsync(notification, coordinatorIds);
        }

        // Send upcoming event notifications to all users
        public async Task SendUpcomingEventNotificationsAsync(IEnumerable<Event> upcomingEvents)
        {
            var users = await _notificationService.GetAllUsersAsync();

            foreach (var ev in upcomingEvents)
            {
                var notification = new Notification
                {
                    EventId = ev.Id,
                    Title = "Upcoming Event",
                    Message = $"Don't miss: '{ev.Title}' from {ev.StartDate:dd MMM} to {ev.EndDate:dd MMM}.",
                    CreatedAt = DateTime.UtcNow
                };

                var userIds = users.Select(u => u.Id).ToList();
                await _notificationService.CreateNotificationAsync(notification, userIds);
            }
        }

        // Send budget deadline notifications to Admins and Coordinators
        public async Task SendBudgetDeadlineNotificationsAsync(IEnumerable<Budget> budgets)
        {
            var adminsAndCoordinators = (await _notificationService.GetUsersByRoleAsync("Admin"))
                .Concat(await _notificationService.GetUsersByRoleAsync("Coordinator"))
                .ToList();

            foreach (var budget in budgets)
            {
                var notification = new Notification
                {
                    BudgetId = budget.Id,
                    Title = "Budget Submission Deadline",
                    Message = $"Budget for '{budget.Event.Title}' must be submitted by {budget.DueDate:dd MMM}.",
                    CreatedAt = DateTime.UtcNow
                };

                var userIds = adminsAndCoordinators.Select(u => u.Id).ToList();
                await _notificationService.CreateNotificationAsync(notification, userIds);
            }
        }

        public async Task<IEnumerable<EventDTO>> GetAllEventsAsync()
        {
            try
            {
                var events = await _eventRepository.GetAllAsync();
                return events.Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in EventService.GetAllEventsAsync");
                throw;
            }
        }

        public async Task<EventDTO?> GetEventByIdAsync(int id)
        {
            try
            {
                var eventEntity = await _eventRepository.GetByIdAsync(id);
                return eventEntity != null ? MapToDto(eventEntity) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in EventService.GetEventByIdAsync for ID {EventId}", id);
                throw;
            }
        }

        public async Task<EventDTO> CreateEventAsync(CreateEventDto createEventDto)
        {
            try
            {
                var eventEntity = MapToEntity(createEventDto);
                var createdEvent = await _eventRepository.CreateAsync(eventEntity);
                return MapToDto(createdEvent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in EventService.CreateEventAsync");
                throw;
            }
        }

        public async Task<EventDTO?> UpdateEventAsync(int id, UpdateEventDto updateEventDto)
        {
            try
            {
                var existingEvent = await _eventRepository.GetByIdAsync(id);
                if (existingEvent == null)
                {
                    return null;
                }

                var eventEntity = MapToEntity(updateEventDto);
                eventEntity.Id = id;
                eventEntity.CreatedAt = existingEvent.CreatedAt;

                var updatedEvent = await _eventRepository.UpdateAsync(eventEntity);
                return updatedEvent != null ? MapToDto(updatedEvent) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in EventService.UpdateEventAsync for ID {EventId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteEventAsync(int id)
        {
            try
            {
                return await _eventRepository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in EventService.DeleteEventAsync for ID {EventId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<EventDTO>> GetEventsByFacultyAsync(string faculty)
        {
            try
            {
                if (Enum.TryParse<Faculty>(faculty, true, out var facultyEnum))
                {
                    var events = await _eventRepository.GetByFacultyAsync(facultyEnum);
                    return events.Select(MapToDto);
                }
                return Enumerable.Empty<EventDTO>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in EventService.GetEventsByFacultyAsync for faculty {Faculty}", faculty);
                throw;
            }
        }

        public async Task<IEnumerable<EventDTO>> GetEventsByScopeAsync(string scope)
        {
            try
            {
                if (Enum.TryParse<EventScope>(scope, true, out var scopeEnum))
                {
                    var events = await _eventRepository.GetByScopeAsync(scopeEnum);
                    return events.Select(MapToDto);
                }
                return Enumerable.Empty<EventDTO>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in EventService.GetEventsByScopeAsync for scope {Scope}", scope);
                throw;
            }
        }

        public async Task<IEnumerable<EventDTO>> GetEventsByStatusAsync(string status)
        {
            try
            {
                if (Enum.TryParse<EventStatus>(status, true, out var statusEnum))
                {
                    var events = await _eventRepository.GetByStatusAsync(statusEnum);
                    return events.Select(MapToDto);
                }
                return Enumerable.Empty<EventDTO>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in EventService.GetEventsByStatusAsync for status {Status}", status);
                throw;
            }
        }

        public async Task<IEnumerable<EventDTO>> GetUpcomingEventsAsync()
        {
            try
            {
                var events = await _eventRepository.GetUpcomingAsync();
                return events.Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in EventService.GetUpcomingEventsAsync");
                throw;
            }
        }

        public async Task<IEnumerable<EventDTO>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            try
            {
                var events = await _eventRepository.GetByDateRangeAsync(startDate, endDate);
                return events.Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in EventService.GetEventsByDateRangeAsync");
                throw;
            }
        }

        private static EventDTO MapToDto(Event eventEntity)
        {
            return new EventDTO
            {
                Id = eventEntity.Id,
                Title = eventEntity.Title,
                Description = eventEntity.Description,
                StartDate = eventEntity.StartDate,
                EndDate = eventEntity.EndDate,
                EventStatus = eventEntity.EventStatus.ToString(),
                Location = eventEntity.Location,
                Faculty = eventEntity.Faculty.ToString(),
                EventScope = eventEntity.EventScope.ToString(),
                EventType = eventEntity.EventType,
                Objective = eventEntity.Objective,
                CreatedAt = eventEntity.CreatedAt,
                UpdatedAt = eventEntity.UpdatedAt
            };
        }

        //private static Event MapToEntity(CreateEventDto createEventDto)
        //{
        //    return new Event
        //    {
        //        Title = createEventDto.Title,
        //        Description = createEventDto.Description,
        //        StartDate = createEventDto.StartDate,
        //        EndDate = createEventDto.EndDate,
        //        EventStatus = Enum.Parse<EventStatus>(createEventDto.EventStatus, true),
        //        Location = createEventDto.Location,
        //        Faculty = Enum.Parse<Faculty>(createEventDto.Faculty, true),
        //        EventScope = Enum.Parse<EventScope>(createEventDto.EventScope, true),
        //        EventType = createEventDto.EventType,
        //        Objective = createEventDto.Objective
        //    };
        //}
        private static Event MapToEntity(CreateEventDto dto)
        {
            if (!Enum.TryParse<EventStatus>(dto.EventStatus, true, out var statusEnum))
                throw new ArgumentException($"Invalid EventStatus: {dto.EventStatus}");

            if (!Enum.TryParse<Faculty>(dto.Faculty, true, out var facultyEnum))
                throw new ArgumentException($"Invalid Faculty: {dto.Faculty}");

            if (!Enum.TryParse<EventScope>(dto.EventScope, true, out var scopeEnum))
                throw new ArgumentException($"Invalid EventScope: {dto.EventScope}");

            return new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                EventStatus = statusEnum,
                Faculty = facultyEnum,
                EventScope = scopeEnum,
                EventType = dto.EventType,
                Objective = dto.Objective,
                Location = dto.Location
            };
        }

        private static Event MapToEntity(UpdateEventDto updateEventDto)
        {
            return new Event
            {
                Title = updateEventDto.Title,
                Description = updateEventDto.Description,
                StartDate = updateEventDto.StartDate,
                EndDate = updateEventDto.EndDate,
                EventStatus = Enum.Parse<EventStatus>(updateEventDto.EventStatus, true),
                Location = updateEventDto.Location,
                Faculty = Enum.Parse<Faculty>(updateEventDto.Faculty, true),
                EventScope = Enum.Parse<EventScope>(updateEventDto.EventScope, true),
                EventType = updateEventDto.EventType,
                Objective = updateEventDto.Objective
            };
        }
        public async Task<bool> AssignTeamAsync(int eventId, int teamId)
        {
            var ev = await _context.Events.FindAsync(eventId);
            var team = await _context.Teams.FindAsync(teamId);

            if (ev == null || team == null)
                return false;

            // Assign team to event
            ev.TeamId = teamId; // assume Events entity has TeamId nullable
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> UnassignTeamAsync(int eventId)
        {
            var ev = await _context.Events.FindAsync(eventId);
            if (ev == null || ev.TeamId == null)
                return false;

            ev.TeamId = null;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
