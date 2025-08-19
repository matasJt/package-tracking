using System.Runtime.CompilerServices;
using System.Text;
using Domain.Enums;

namespace Domain.Entities;

public class Package(Contact sender, Contact receiver)
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string TrackingNumber { get; init; } = CreateUniqueId();

    public Guid SenderId { get; set; }
    public Contact Sender { get; set; } = sender;

    public Guid RecipientId { get; set; }
    public Contact Recipient { get; set; } = receiver;

    public Status CurrentStatus { get; set; } = Status.Created;
    public DateTime Created { get; init; } = DateTime.UtcNow;
    public List<PackageHistory> History { get; set; } = new List<PackageHistory>();

    private Package() : this(null!, null!) { }

    private static string CreateUniqueId()
    {
        StringBuilder builder = new StringBuilder();
        Enumerable
            .Range(65, 26).Select(e => ((char)e).ToString())
            .Concat(Enumerable.Range(97, 26).Select(e => ((char)e).ToString()))
            .Concat(Enumerable.Range(0, 10).Select(e => e.ToString()))
            .OrderBy(e => Guid.NewGuid())
            .Take(8)
            .ToList()
            .ForEach(e => builder.Append(e));
        return builder.ToString();
    }

    public void UpdateHistory(PackageHistory history)
    {
        History.Add(history);
    }
    
}