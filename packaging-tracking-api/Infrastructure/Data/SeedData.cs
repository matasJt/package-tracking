using Bogus;
using Domain.Entities;

namespace Infrastructure.Data;

public class SeedData(PackageDbContext context)
{
    public async Task SeedAsync()
    {
        await context.Database.EnsureCreatedAsync();
        var fakerContact = new Faker<Contact>().CustomInstantiator(c =>
            new Contact(c.Address.StreetAddress(), c.Name.FirstName(), c.Phone.PhoneNumber()));
        var fakerPackages =
            new Faker<Package>().CustomInstantiator(p => new Package(fakerContact.Generate(), fakerContact.Generate()));
        var packages = fakerPackages.Generate(10);
        foreach (var package in packages)
        {
            var initialHistory = new PackageHistory(package.CurrentStatus);
            package.UpdateHistory(initialHistory);
        }
        context.Packages.AddRange(packages);
        await context.SaveChangesAsync();
    }
}