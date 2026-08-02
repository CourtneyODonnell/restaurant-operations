using Microsoft.EntityFrameworkCore;
using RestaurantOperations.Api.Models;

namespace RestaurantOperations.Api.Data;

public class RestaurantOperationsDbContext : DbContext
{
    public RestaurantOperationsDbContext(
        DbContextOptions<RestaurantOperationsDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<InventoryCount> InventoryCounts => Set<InventoryCount>();
    public DbSet<InventoryCountLine> InventoryCountLines => Set<InventoryCountLine>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>()
            .HasIndex(product => product.Sku)
            .IsUnique();

        modelBuilder.Entity<Product>()
            .Property(product => product.Name)
            .HasMaxLength(200);

        modelBuilder.Entity<Product>()
            .Property(product => product.Sku)
            .HasMaxLength(50);

        modelBuilder.Entity<InventoryCountLine>()
            .Property(line => line.ExpectedQuantity)
            .HasPrecision(18, 2);

        modelBuilder.Entity<InventoryCountLine>()
            .Property(line => line.ActualQuantity)
            .HasPrecision(18, 2);

        modelBuilder.Entity<InventoryCountLine>()
            .Property(line => line.VarianceReason)
            .HasMaxLength(500);
    }
}