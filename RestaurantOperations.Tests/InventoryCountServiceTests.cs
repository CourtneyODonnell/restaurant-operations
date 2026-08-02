using Microsoft.EntityFrameworkCore;
using RestaurantOperations.Api.Data;
using RestaurantOperations.Api.Models;
using RestaurantOperations.Api.Services;

namespace RestaurantOperations.Tests;

public class InventoryCountServiceTests
{
    [Fact]
    public async Task FinalizeAsync_RejectsVarianceWithoutReason()
    {
        await using var dbContext = CreateDbContext();
        var count = CreateCount(expected: 10, actual: 8, reason: null);

        dbContext.InventoryCounts.Add(count);
        await dbContext.SaveChangesAsync();

        var service = new InventoryCountService(dbContext);

        var result = await service.FinalizeAsync(
            count.Id,
            CancellationToken.None);

        Assert.False(result.Succeeded);
        Assert.Contains(
            "variance reason",
            result.Error,
            StringComparison.OrdinalIgnoreCase);
        Assert.Equal(InventoryCountStatus.Draft, count.Status);
    }

    [Fact]
    public async Task FinalizeAsync_AllowsZeroVarianceWithoutReason()
    {
        await using var dbContext = CreateDbContext();
        var count = CreateCount(expected: 10, actual: 10, reason: null);

        dbContext.InventoryCounts.Add(count);
        await dbContext.SaveChangesAsync();

        var service = new InventoryCountService(dbContext);

        var result = await service.FinalizeAsync(
            count.Id,
            CancellationToken.None);

        Assert.True(result.Succeeded);
        Assert.Equal(InventoryCountStatus.Finalized, count.Status);
        Assert.NotNull(count.FinalizedAt);
    }

    [Fact]
    public async Task FinalizeAsync_AllowsVarianceWithValidReason()
    {
        await using var dbContext = CreateDbContext();
        var count = CreateCount(
            10,
            8,
            "Two units were damaged.");

        dbContext.InventoryCounts.Add(count);
        await dbContext.SaveChangesAsync();

        var service = new InventoryCountService(dbContext);

        var result = await service.FinalizeAsync(
            count.Id,
            CancellationToken.None);

        Assert.True(result.Succeeded);
        Assert.Equal(InventoryCountStatus.Finalized, count.Status);
    }

    [Fact]
    public async Task FinalizeAsync_RejectsEmptyCount()
    {
        await using var dbContext = CreateDbContext();
        var count = new InventoryCount
        {
            CountDate = DateTime.UtcNow
        };

        dbContext.InventoryCounts.Add(count);
        await dbContext.SaveChangesAsync();

        var service = new InventoryCountService(dbContext);

        var result = await service.FinalizeAsync(
            count.Id,
            CancellationToken.None);

        Assert.False(result.Succeeded);
        Assert.Contains("at least one line", result.Error);
    }

    [Fact]
    public async Task FinalizeAsync_RejectsAlreadyFinalizedCount()
    {
        await using var dbContext = CreateDbContext();
        var count = CreateCount(10, 10, null);
        count.Status = InventoryCountStatus.Finalized;

        dbContext.InventoryCounts.Add(count);
        await dbContext.SaveChangesAsync();

        var service = new InventoryCountService(dbContext);

        var result = await service.FinalizeAsync(
            count.Id,
            CancellationToken.None);

        Assert.False(result.Succeeded);
        Assert.Contains("already finalized", result.Error);
    }

    private static RestaurantOperationsDbContext CreateDbContext()
    {
        var options =
            new DbContextOptionsBuilder<RestaurantOperationsDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

        return new RestaurantOperationsDbContext(options);
    }

    private static InventoryCount CreateCount(
        decimal expected,
        decimal actual,
        string? reason)
    {
        var product = new Product
        {
            Name = "Test Product",
            Sku = Guid.NewGuid().ToString()
        };

        return new InventoryCount
        {
            CountDate = DateTime.UtcNow,
            Lines =
            [
                new InventoryCountLine
                {
                    Product = product,
                    ExpectedQuantity = expected,
                    ActualQuantity = actual,
                    VarianceReason = reason
                }
            ]
        };
    }
}