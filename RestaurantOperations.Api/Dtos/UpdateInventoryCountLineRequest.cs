using System.ComponentModel.DataAnnotations;

namespace RestaurantOperations.Api.Dtos;

public class UpdateInventoryCountLineRequest
{
    [Range(0, double.MaxValue)]
    public decimal ExpectedQuantity { get; set; }

    [Range(0, double.MaxValue)]
    public decimal ActualQuantity { get; set; }

    [MaxLength(500)]
    public string? VarianceReason { get; set; }
}