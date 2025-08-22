using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class PackageRepository(PackageDbContext dbcontext) : IPackageRepository
{
    public async Task<Package?> GetAsync(Guid id)
    {
        return await dbcontext.Packages
            .Include(g => g.Recipient)
            .Include(g => g.Sender)
            .Include(g => g.History)
            .FirstOrDefaultAsync(p => p.Id == id);
    }
    public async Task<List<Package>> GetAllAsync()
    {
        return await dbcontext.Packages
            .Include(g => g.Recipient)
            .Include(g => g.Sender).ToListAsync();
    }
    public async Task AddAsync(Package package)
    {
        dbcontext.Packages.Add(package);
        await dbcontext.SaveChangesAsync();
    }

    public async Task UpdateAsync(Package package)
    {
        var existingHistoryIds = await dbcontext.PackageHistory
            .Where(h => h.PackageId == package.Id)
            .Select(h => h.Id)
            .ToListAsync();
    
        var newHistoryItems = package.History.Where(h => !existingHistoryIds.Contains(h.Id));
    
        foreach (var newHistory in newHistoryItems)
        {
            dbcontext.PackageHistory.Add(newHistory);
        }
    
        await dbcontext.SaveChangesAsync();
    }
}