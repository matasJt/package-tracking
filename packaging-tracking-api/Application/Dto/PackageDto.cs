using Domain.Entities;
using Domain.Enums;

namespace Application.Dto;

public record PackageDto(string Status, string TrackingNumber, DateTime Created, SenderDto Sender, RecipientDto Receiver)
{
    public static PackageDto From(Package? package) =>
        new(package.CurrentStatus.ToString(), package.TrackingNumber, package.Created,
            SenderDto.From(package.Sender), 
            RecipientDto.From(package.Recipient));
}

public record CreatePackageDto
{
    public SenderDto? Sender { get; init; }
    public RecipientDto? Recipient { get; init; }
}