namespace Application.Dto;

public class PaginatedDto
{
    public List<PackageDto> Packages { get; set; }
    public double TotalPageCount { get; set; }
}