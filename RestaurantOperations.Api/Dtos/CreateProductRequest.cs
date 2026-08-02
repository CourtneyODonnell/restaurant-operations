using System.ComponentModel.DataAnnotations;

namespace RestaurantOperations.Api.Dtos;

public class CreateProductRequest
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Sku { get; set; } = string.Empty;
}