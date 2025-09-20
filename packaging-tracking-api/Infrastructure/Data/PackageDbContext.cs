using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class PackageDbContext(DbContextOptions<PackageDbContext> options) : DbContext(options)
{
    public DbSet<Package> Packages { get; set; }
    public DbSet<PackageHistory> PackageHistory { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Package>()
            .HasOne(p => p.Sender)
            .WithOne()
            .HasForeignKey<Package>(p => p.SenderId);

        modelBuilder.Entity<Package>()
            .HasOne(p => p.Recipient)
            .WithOne()
            .HasForeignKey<Package>(p => p.RecipientId);
        modelBuilder.Entity<Package>()
            .HasMany(p=> p.History)
            .WithOne(h => h.Package)
            .HasForeignKey(h => h.PackageId);
    }
}
