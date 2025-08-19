using Application.Dto;
using Domain.Entities;

namespace Application.Interfaces;

public interface IPackageRepository
{
    public Task<Package?> GetAsync(Guid id);
    public Task<List<Package>> GetAllAsync();
    public Task AddAsync(Package package);
    public Task UpdateAsync(Package package);
    public Task AddHis(PackageHistory history);
}