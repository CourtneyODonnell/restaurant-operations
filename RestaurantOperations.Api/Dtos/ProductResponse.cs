namespace RestaurantOperations.Api.Dtos;

public record ProductResponse(
    int Id,
    string Name,
    string Sku,
    bool IsActive);