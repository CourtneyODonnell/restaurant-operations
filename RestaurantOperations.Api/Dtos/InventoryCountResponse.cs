namespace RestaurantOperations.Api.Dtos;

public record InventoryCountLineResponse(
    int Id,
    int ProductId,
    string ProductName,
    decimal ExpectedQuantity,
    decimal ActualQuantity,
    decimal Variance,
    string? VarianceReason);

public record InventoryCountResponse(
    int Id,
    DateTime CountDate,
    string Status,
    DateTime? FinalizedAt,
    List<InventoryCountLineResponse> Lines);