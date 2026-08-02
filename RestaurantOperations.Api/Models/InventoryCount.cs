namespace RestaurantOperations.Api.Models;

public class InventoryCount
{
    public int Id { get; set; }
    public DateTime CountDate { get; set; }
    public InventoryCountStatus Status { get; set; } = InventoryCountStatus.Draft;
    public DateTime? FinalizedAt { get; set; }
    public List<InventoryCountLine> Lines { get; set; } = [];
}
