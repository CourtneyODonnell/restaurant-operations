namespace RestaurantOperations.Api.Models;

public class InventoryCountLine
{
    public int Id { get; set; }
    public int InventoryCountId { get; set; }
    public InventoryCount InventoryCount { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public decimal ExpectedQuantity { get; set; }
    public decimal ActualQuantity { get; set; }
    public string? VarianceReason { get; set; }

    public decimal Variance => ActualQuantity - ExpectedQuantity;
}
