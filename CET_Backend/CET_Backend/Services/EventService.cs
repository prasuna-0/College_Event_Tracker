using CET_Backend.Data;
using CET_Backend.Entities;
using CET_Backend.Enums;
using CET_Backend.Interfaces;
using CET_Backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

            ev.TeamId = teamId; 
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
        public async Task<bool> RegisterStudentAsync(int eventId, int studentId)
        {
            var existing = await _context.EventRegistrations
                .FirstOrDefaultAsync(r => r.EventId == eventId && r.StudentId == studentId);

            if (existing != null)
                return false; 

            var ev = await _context.Events.FindAsync(eventId);
            if (ev == null)
                return false;

            var registration = new EventRegistration
            {
                EventId = eventId,
                StudentId = studentId,
                RegisteredAt = DateTime.UtcNow
            };

            _context.EventRegistrations.Add(registration);
            await _context.SaveChangesAsync();
            return true;
        }
      
        public async Task<bool> CancelRegistrationAsync(int eventId, int studentId)
        {
            var registration = await _context.EventRegistrations
                .FirstOrDefaultAsync(r => r.EventId == eventId && r.StudentId == studentId);

            if (registration == null)
                return false; 

            var ev = await _context.Events.FindAsync(eventId);
            if (ev == null)
                return false; 

            if ((ev.StartDate - DateTime.UtcNow).TotalDays < 7)
                return false;

            _context.EventRegistrations.Remove(registration);
            await _context.SaveChangesAsync();
            return true;
        }
        
      
        public async Task<IEnumerable<EventDTO>> GetRegisteredEventsAsync(int studentId)
        {
            var events = await _context.EventRegistrations
                .Where(r => r.StudentId == studentId)
                .Include(r => r.Event)
                .Select(r => new EventDTO
                {
                    Id = r.Event.Id,
                    Title = r.Event.Title,
                    Description = r.Event.Description,
                    StartDate = r.Event.StartDate,
                    EndDate = r.Event.EndDate,
                    EventStatus = r.Event.EventStatus.ToString(),
                    Location = r.Event.Location,
                    Faculty = r.Event.Faculty.ToString(),
                    EventScope = r.Event.EventScope.ToString(),
                    EventType = r.Event.EventType,
                    Objective = r.Event.Objective,
                    CreatedAt = r.Event.CreatedAt,
                    UpdatedAt = r.Event.UpdatedAt,
                    TeamId = r.Event.TeamId
                })
                .ToListAsync();

            return events;
        }
        public async Task UpdateStatusesAsync(IEnumerable<EventDTO> events)
        {
            var eventIds = events.Select(e => e.Id).ToList();
            var dbEvents = await _context.Events
                .Where(e => eventIds.Contains(e.Id))
                .ToListAsync();

            foreach (var dbEvent in dbEvents)
            {
                var updatedEvent = events.First(e => e.Id == dbEvent.Id);

                if (Enum.TryParse(updatedEvent.EventStatus, out EventStatus newStatus))
                {
                    if (dbEvent.EventStatus != newStatus)
                        dbEvent.EventStatus = newStatus;
                }
            }

            await _context.SaveChangesAsync();
        }

    }
}
