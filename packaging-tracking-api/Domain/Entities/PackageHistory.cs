using Domain.Enums;

namespace Domain.Entities;

public class PackageHistory(Status updatedStatus)
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Status CurrentStatus { get; init; } = updatedStatus;
    public DateTime Updated { get; init; } = DateTime.UtcNow;
    public Guid PackageId { get; set; }
    public Package? Package { get; set; }
    private PackageHistory() : this(Status.Created) { }
}