using Application.Dto;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class PackageService(IPackageRepository repository)
{
    private const int PageSize = 10;
    public async Task<PackageDto> CreatePackage(CreatePackageDto dto)
    {
        var newPackage = new Package(
            new Contact(dto.Sender.Address, dto.Sender.Name, dto.Sender.Phone),
            new Contact(dto.Recipient.Address, dto.Recipient.Name, dto.Recipient.Phone)
        );
        var initialHistory = new PackageHistory(newPackage.CurrentStatus);
        newPackage.UpdateHistory(initialHistory);
        await repository.AddAsync(newPackage);
        return PackageDto.From(newPackage);
    }

    public async Task<PackageDto?> GetPackage(Guid packageId)
    {
        var package = await repository.GetAsync(packageId);
        if (package == null)
        {
            return null;
        }
        return PackageDto.From(package);
    }

    public async Task<PaginatedDto> GetPackages(int  page,string statusFilter, string trackingNumberFilter)
    {
        var query = repository.GetAllAsync();

        if (!string.IsNullOrEmpty(statusFilter) && Enum.TryParse(statusFilter, false, out Status status))
        {
            query = query.Where(p => p.CurrentStatus == status);
        }

        if (!string.IsNullOrEmpty(trackingNumberFilter))
        {
            query = query.Where(p => p.TrackingNumber == trackingNumberFilter);
        }

        var packagesCount = query.CountAsync().Result;
        var packagesPaginated = await query.Skip((page - 1) * PageSize).Take(PageSize).ToListAsync();
        return (new PaginatedDto
        {
            Packages = packagesPaginated.Select(package => PackageDto.From(package)).ToList(),
            TotalPageCount = Math.Ceiling(packagesCount / (double)PageSize)
        });
    }

    public async Task<List<PackageHistoryDto>?> GetPackageHistory(Guid id)
    {
        var package = await repository.GetAsync(id);
        if (package == null)
        {
            return null;
        }
        var packageHistory = package.History;
       
        return packageHistory.Select(PackageHistoryDto.From).ToList();
    }

    public async Task<ResultSerivce<PackageDto?>> UpdatePackageStatus(Guid id,string status)
    {
        var package = await repository.GetAsync(id);
        if (!Enum.TryParse(status, false, out Status newStatus))
        {
            return ResultSerivce<PackageDto?>.Fail($"Invalid status: {status}");
        }
        if (package == null)
        {
            return ResultSerivce<PackageDto?>.Fail("Package not found");
        }

        if (package.CurrentStatus == Status.Accepted || package.CurrentStatus == Status.Cancelled)
        {
            return ResultSerivce<PackageDto?>.Fail($"Cannot update package status from {package.CurrentStatus.ToString()} status");
        }
        
        switch (package.CurrentStatus, newStatus)
        {
            case (Status.Created, Status.Sent):
                package.CurrentStatus = Status.Sent;
                break;
            case (Status.Created, Status.Cancelled):
                package.CurrentStatus = Status.Cancelled;
                break;
            
            case (Status.Sent, Status.Accepted):
                package.CurrentStatus = Status.Accepted;
                break;
            case (Status.Sent, Status.Returned):
                package.CurrentStatus = Status.Returned;
                break;
            case (Status.Sent, Status.Cancelled):
                package.CurrentStatus = Status.Cancelled;
                break;
            
            case (Status.Returned, Status.Sent):
                package.CurrentStatus = Status.Sent;
                break;
            case (Status.Returned, Status.Cancelled):
                package.CurrentStatus = Status.Cancelled;
                break;
            
            default:
                return ResultSerivce<PackageDto?>.Fail($"Unknown status or invalid transition to: {status}");
        }

        var newHistory = new PackageHistory(package.CurrentStatus)
        {
            PackageId = package.Id
        };
        package.UpdateHistory(newHistory);
        await repository.UpdateAsync(package);
        return ResultSerivce<PackageDto?>.Ok("Package updated",PackageDto.From(package));
    }
    
}