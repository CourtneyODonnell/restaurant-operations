using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantOperations.Api.Data;
using RestaurantOperations.Api.Dtos;
using RestaurantOperations.Api.Models;
using RestaurantOperations.Api.Services;

namespace RestaurantOperations.Api.Controllers;

[ApiController]
[Route("api/inventory-counts")]
public class InventoryCountsController : ControllerBase
{
    private readonly RestaurantOperationsDbContext _dbContext;
    private readonly InventoryCountService _service;

    public InventoryCountsController(
        RestaurantOperationsDbContext dbContext,
        InventoryCountService service)
    {
        _dbContext = dbContext;
        _service = service;
    }

    [HttpPost]
    public async Task<ActionResult<InventoryCountResponse>> Create(
        CreateInventoryCountRequest request,
        CancellationToken cancellationToken)
    {
        var count = new InventoryCount
        {
            CountDate = request.CountDate == default
                ? DateTime.UtcNow
                : request.CountDate
        };

        _dbContext.InventoryCounts.Add(count);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = count.Id },
            Map(count));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<InventoryCountResponse>> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var count = await _dbContext.InventoryCounts
            .Include(inventoryCount => inventoryCount.Lines)
            .ThenInclude(line => line.Product)
            .SingleOrDefaultAsync(
                inventoryCount => inventoryCount.Id == id,
                cancellationToken);

        return count is null
            ? NotFound()
            : Ok(Map(count));
    }

    [HttpPost("{id:int}/lines")]
    public async Task<ActionResult<InventoryCountResponse>> AddLine(
        int id,
        AddInventoryCountLineRequest request,
        CancellationToken cancellationToken)
    {
        var count = await _dbContext.InventoryCounts
            .Include(inventoryCount => inventoryCount.Lines)
            .ThenInclude(line => line.Product)
            .SingleOrDefaultAsync(
                inventoryCount => inventoryCount.Id == id,
                cancellationToken);

        if (count is null)
        {
            return NotFound();
        }

        if (count.Status == InventoryCountStatus.Finalized)
        {
            return Conflict("A finalized inventory count cannot be edited.");
        }

        var product = await _dbContext.Products
            .SingleOrDefaultAsync(
                product => product.Id == request.ProductId && product.IsActive,
                cancellationToken);

        if (product is null)
        {
            return BadRequest(
                "The selected product does not exist or is inactive.");
        }

        if (count.Lines.Any(line => line.ProductId == request.ProductId))
        {
            return Conflict(
                "The product is already present on this inventory count.");
        }

        count.Lines.Add(new InventoryCountLine
        {
            ProductId = product.Id,
            Product = product,
            ExpectedQuantity = request.ExpectedQuantity,
            ActualQuantity = request.ActualQuantity,
            VarianceReason = request.VarianceReason?.Trim()
        });

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(Map(count));
    }

    [HttpPut("{id:int}/lines/{lineId:int}")]
    public async Task<ActionResult<InventoryCountResponse>> UpdateLine(
        int id,
        int lineId,
        UpdateInventoryCountLineRequest request,
        CancellationToken cancellationToken)
    {
        var count = await _dbContext.InventoryCounts
            .Include(inventoryCount => inventoryCount.Lines)
            .ThenInclude(line => line.Product)
            .SingleOrDefaultAsync(
                inventoryCount => inventoryCount.Id == id,
                cancellationToken);

        if (count is null)
        {
            return NotFound();
        }

        if (count.Status == InventoryCountStatus.Finalized)
        {
            return Conflict("A finalized inventory count cannot be edited.");
        }

        var line = count.Lines
            .SingleOrDefault(line => line.Id == lineId);

        if (line is null)
        {
            return NotFound("Inventory count line was not found.");
        }

        line.ExpectedQuantity = request.ExpectedQuantity;
        line.ActualQuantity = request.ActualQuantity;
        line.VarianceReason = request.VarianceReason?.Trim();

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(Map(count));
    }

    [HttpPost("{id:int}/finalize")]
    public async Task<IActionResult> Finalize(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await _service.FinalizeAsync(
            id,
            cancellationToken);

        if (!result.Succeeded)
        {
            return BadRequest(new { error = result.Error });
        }

        return NoContent();
    }

    private static InventoryCountResponse Map(InventoryCount count)
    {
        var lines = count.Lines
            .Select(line => new InventoryCountLineResponse(
                line.Id,
                line.ProductId,
                line.Product?.Name ?? string.Empty,
                line.ExpectedQuantity,
                line.ActualQuantity,
                line.Variance,
                line.VarianceReason))
            .ToList();

        return new InventoryCountResponse(
            count.Id,
            count.CountDate,
            count.Status.ToString(),
            count.FinalizedAt,
            lines);
    }
}
