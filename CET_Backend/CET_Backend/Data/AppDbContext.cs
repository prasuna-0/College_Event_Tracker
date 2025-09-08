using CET_Backend.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace CET_Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Event> Events { get; set; }
        public DbSet<Budget> Budgets => Set<Budget>();
        public DbSet<Expense> Expenses => Set<Expense>();
        public DbSet<BudgetHead> BudgetHeads { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationUser> NotificationUsers { get; set; }
        public DbSet<Volunteer> Volunteers { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<TeamVolunteer> TeamVolunteers { get; set; }
        public DbSet<EventVolunteer> EventVolunteers { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Album> Albums { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Event entity
            modelBuilder.Entity<Event>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(1000);

                entity.Property(e => e.EventStatus)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(e => e.Location)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Faculty)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(e => e.EventScope)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(e => e.EventType)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Objective)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.StartDate)
                    .IsRequired();

                entity.Property(e => e.EndDate)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.UpdatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Add indexes for better query performance
                entity.HasIndex(e => e.Faculty);
                entity.HasIndex(e => e.EventScope);
                entity.HasIndex(e => e.EventStatus);
                entity.HasIndex(e => e.StartDate);
                entity.HasIndex(e => e.CreatedAt);
            });
            modelBuilder.Entity<Student>()
    .HasOne(s => s.User)
    .WithOne(u => u.Student)
    .HasForeignKey<Student>(s => s.UserId)
    .IsRequired();

            modelBuilder.Entity<Admin>()
                .HasOne(a => a.User)
                .WithOne(u => u.Admin)
                .HasForeignKey<Admin>(a => a.UserId)
                .IsRequired();

            modelBuilder.Entity<Coordinator>()
                .HasOne(c => c.User)
                .WithOne(u => u.Coordinator)
                .HasForeignKey<Coordinator>(c => c.UserId)
                .IsRequired();
            modelBuilder.Entity<Budget>()
           .HasIndex(b => b.EventId)
           .IsUnique(); // 1:1 Event->Budget


            modelBuilder.Entity<Budget>()
            .HasOne(b => b.Event)
            .WithOne()
            .HasForeignKey<Budget>(b => b.EventId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Budget>()
         .HasMany(b => b.BudgetHeads)
         .WithOne(h => h.Budget)
         .HasForeignKey(h => h.BudgetId)
         .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Expense>()
            .HasOne(e => e.Budget)
            .WithMany(b => b.Expenses)
            .HasForeignKey(e => e.BudgetId)
            .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<TeamVolunteer>()
               .HasKey(tv => new { tv.TeamId, tv.VolunteerId });

            modelBuilder.Entity<TeamVolunteer>()
                .HasOne(tv => tv.Team)
                .WithMany(t => t.TeamVolunteers)
                .HasForeignKey(tv => tv.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TeamVolunteer>()
                .HasOne(tv => tv.Volunteer)
                .WithMany(v => v.TeamVolunteers)
                .HasForeignKey(tv => tv.VolunteerId)
                .OnDelete(DeleteBehavior.Cascade);

            // ---------------- EventVolunteer Many-to-Many ----------------
            modelBuilder.Entity<EventVolunteer>()
                .HasKey(ev => new { ev.EventId, ev.VolunteerId });

            modelBuilder.Entity<EventVolunteer>()
                .HasOne(ev => ev.Event)
                .WithMany(e => e.EventVolunteers)
                .HasForeignKey(ev => ev.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<EventVolunteer>()
                .HasOne(ev => ev.Volunteer)
                .WithMany(v => v.EventVolunteers)
                .HasForeignKey(ev => ev.VolunteerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Team>()
       .HasMany(t => t.Members)
       .WithOne(u => u.Team)
       .HasForeignKey(u => u.TeamId)
       .OnDelete(DeleteBehavior.SetNull);

        }
        public DbSet<User> Users => Set<User>();
        public DbSet<Student> Students { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Coordinator> Coordinators { get; set; }
        public DbSet<Role> Roles { get; set; }

        //public DbSet<EventScope> EventScopes { get; set; }
        //public DbSet<EventObjective> EventObjectives { get; set; }
        //public DbSet<EventType> EventTypes { get; set; }
    }
}
