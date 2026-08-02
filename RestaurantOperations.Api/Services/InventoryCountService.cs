using Microsoft.EntityFrameworkCore;
using RestaurantOperations.Api.Data;
using RestaurantOperations.Api.Models;

namespace RestaurantOperations.Api.Services;

public class InventoryCountService
{
    private readonly RestaurantOperationsDbContext _dbContext;

    public InventoryCountService(RestaurantOperationsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(bool Succeeded, string? Error)> FinalizeAsync(
        int inventoryCountId,
        CancellationToken cancellationToken)
    {
        var count = await _dbContext.InventoryCounts
            .Include(inventoryCount => inventoryCount.Lines)
            .SingleOrDefaultAsync(
                inventoryCount => inventoryCount.Id == inventoryCountId,
                cancellationToken);

        if (count is null)
        {
            return (false, "Inventory count was not found.");
        }

        if (count.Status == InventoryCountStatus.Finalized)
        {
            return (false, "Inventory count is already finalized.");
        }

        if (count.Lines.Count == 0)
        {
            return (false, "Inventory count must contain at least one line.");
        }

        foreach (var line in count.Lines.Where(line => line.Variance != 0))
        {
            var reason = line.VarianceReason?.Trim();

            if (string.IsNullOrWhiteSpace(reason) ||
                reason.Length is < 10 or > 500)
            {
                return (
                    false,
                    $"Line {line.Id} requires a variance reason between 10 and 500 characters.");
            }
        }

        count.Status = InventoryCountStatus.Finalized;
        count.FinalizedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return (true, null);
    }
}