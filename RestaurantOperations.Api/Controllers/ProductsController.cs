using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantOperations.Api.Data;
using RestaurantOperations.Api.Dtos;
using RestaurantOperations.Api.Models;

namespace RestaurantOperations.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly RestaurantOperationsDbContext _dbContext;

    public ProductsController(RestaurantOperationsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProductResponse>>> GetAll(
        CancellationToken cancellationToken)
    {
        var products = await _dbContext.Products
            .AsNoTracking()
            .OrderBy(product => product.Name)
            .Select(product => new ProductResponse(
                product.Id,
                product.Name,
                product.Sku,
                product.IsActive))
            .ToListAsync(cancellationToken);

        return Ok(products);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductResponse>> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var product = await _dbContext.Products
            .AsNoTracking()
            .Where(product => product.Id == id)
            .Select(product => new ProductResponse(
                product.Id,
                product.Name,
                product.Sku,
                product.IsActive))
            .SingleOrDefaultAsync(cancellationToken);

        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<ProductResponse>> Create(
        CreateProductRequest request,
        CancellationToken cancellationToken)
    {
        var normalizedSku = request.Sku.Trim().ToUpperInvariant();

        var skuExists = await _dbContext.Products
            .AnyAsync(product => product.Sku == normalizedSku, cancellationToken);

        if (skuExists)
        {
            ModelState.AddModelError(nameof(request.Sku), "SKU must be unique.");
            return ValidationProblem(ModelState);
        }

        var product = new Product
        {
            Name = request.Name.Trim(),
            Sku = normalizedSku
        };

        _dbContext.Products.Add(product);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var response = new ProductResponse(
            product.Id,
            product.Name,
            product.Sku,
            product.IsActive);

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, response);
    }
}
