using System.ComponentModel.DataAnnotations;
using Domain.Entities;

namespace Application.Dto;

public record RecipientDto(
    [MinLength(1)] string Name,
    [MinLength(5)] string Address,
    [Phone] string Phone
)
{
    public static RecipientDto From(Contact recipient) =>
        new RecipientDto(recipient.Name, recipient.Phone, recipient.Address);
}