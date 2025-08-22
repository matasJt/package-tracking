using Domain.Entities;

namespace Application.Dto;

public record PackageHistoryDto(string CurrentStatus, DateTime Updated)
{
    public static PackageHistoryDto From(PackageHistory packageHistory) =>
        new PackageHistoryDto(packageHistory.CurrentStatus.ToString(), packageHistory.Updated);
}