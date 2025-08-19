using Application.Dto;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;

namespace Application.Services;

public class PackageService(IPackageRepository repository)
{
    public async Task<PackageDto> CreatePackage(CreatePackageDto dto)
    {
        var newPackage = new Package(
            new Contact(dto.Sender.Address, dto.Sender.Name, dto.Sender.Phone),
            new Contact(dto.Recipient.Address, dto.Recipient.Name, dto.Recipient.Phone)
        );
        var initialHistory = new PackageHistory(newPackage.CurrentStatus);
        newPackage.UpdateHistory(initialHistory);
        await repository.AddAsync(newPackage);
        Console.Write(newPackage.Id);
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

    public async Task<List<PackageDto>> GetPackages()
    {
        var packages = await repository.GetAllAsync();
        return packages.Select(package => PackageDto.From(package)).ToList();
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
        if (package == null)
        {
            return ResultSerivce<PackageDto?>.Fail("Package not found");
        }

        if (package.CurrentStatus == Status.Accepted || package.CurrentStatus == Status.Cancelled)
        {
            return ResultSerivce<PackageDto?>.Fail($"Cannot update package status from {package.CurrentStatus.ToString()} status");
        }
        
        switch (package.CurrentStatus, status)
        {
            case (Status.Created, "Sent"):
                package.CurrentStatus = Status.Sent;
                break;
            case (Status.Created, "Cancelled"):
                package.CurrentStatus = Status.Cancelled;
                break;
            
            case (Status.Sent, "Accepted"):
                package.CurrentStatus = Status.Accepted;
                break;
            case (Status.Sent, "Return"):
                package.CurrentStatus = Status.Returned;
                break;
            case (Status.Sent, "Cancelled"):
                package.CurrentStatus = Status.Cancelled;
                break;
            
            case (Status.Returned, "Sent"):
                package.CurrentStatus = Status.Sent;
                break;
            case (Status.Returned, "Cancelled"):
                package.CurrentStatus = Status.Cancelled;
                break;
            
            default:
                return ResultSerivce<PackageDto?>.Fail($"Unknown status or invalid transition: {status}");
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