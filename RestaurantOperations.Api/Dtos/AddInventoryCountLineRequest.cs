using System.ComponentModel.DataAnnotations;

namespace RestaurantOperations.Api.Dtos;

public class AddInventoryCountLineRequest
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Range(0, double.MaxValue)]
    public decimal ExpectedQuantity { get; set; }

    [Range(0, double.MaxValue)]
    public decimal ActualQuantity { get; set; }

    [MaxLength(500)]
    public string? VarianceReason { get; set; }
}