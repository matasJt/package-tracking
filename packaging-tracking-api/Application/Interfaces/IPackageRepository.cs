using Domain.Entities;

namespace Application.Interfaces;

public interface IPackageRepository
{
    public Task<Package?> GetAsync(Guid id);
    public IQueryable<Package> GetAllAsync();
    public Task AddAsync(Package package);
    public Task UpdateAsync(Package package);
}