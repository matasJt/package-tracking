
namespace Domain.Entities;

public class Contact(string address, string name, string phone)
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Address { get; set; } = address;
    public string Name { get; set; } = name;
    public string Phone { get; set; } = phone;
    
}