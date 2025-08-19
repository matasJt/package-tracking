using System.ComponentModel.DataAnnotations;
using Domain.Entities;

namespace Application.Dto;

public record SenderDto(
    [MinLength(1)] string Name,
    [MinLength(5)] string Address,
    [Phone] string Phone)
{
    public static SenderDto From(Contact sender) => new SenderDto(sender.Name, sender.Address, sender.Phone);
}