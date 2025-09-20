using Application.Dto;
using Application.Interfaces;
using Application.Services;
using Domain.Entities;
using Moq;

namespace Tests;

public class PackageTest
{
   
    [Fact]
    public async Task GetPackage_ReturnsPackage_WhenExists()
    {
        var mockData = new Package(new Contact("address", "name", "phone"), new Contact("address", "name", "phone"));
       
       var repositoryMock = new Mock<IPackageRepository>();
       repositoryMock.Setup(x=> x.GetAsync(mockData.Id)).ReturnsAsync(mockData);
       var service = new PackageService(repositoryMock.Object);
       
       var result = await service.GetPackage(mockData.Id);
        
        Assert.NotNull(result);
        Assert.IsType<PackageDto>(result);
        
    }
    
}