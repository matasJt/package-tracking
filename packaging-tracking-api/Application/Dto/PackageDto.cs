using Domain.Entities;

namespace Application.Dto;

public record PackageDto(Guid Id, string Status, string TrackingNumber, DateTime Created, SenderDto Sender, RecipientDto Receiver)
{
    public static PackageDto From(Package? package) =>
        new(package.Id, package.CurrentStatus.ToString(), package.TrackingNumber, package.Created,
            SenderDto.From(package.Sender), 
            RecipientDto.From(package.Recipient));
}

public record CreatePackageDto
{
    public SenderDto? Sender { get; init; }
    public RecipientDto? Recipient { get; init; }
}