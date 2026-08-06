import { apiRequest } from "./http";
import type { InventoryCount } from "../types/api";

export function createInventoryCount(countDate: string): Promise<InventoryCount> {
    return apiRequest<InventoryCount>("/api/inventory-counts", {
        method: "POST",
        body: JSON.stringify({ countDate }),
    });
}
export function getInventoryCounts(): Promise<InventoryCount[]> {
    return apiRequest<InventoryCount[]>("/api/inventory-counts");
}
export function getInventoryCount(id: number): Promise<InventoryCount> {
    return apiRequest<InventoryCount>(`/api/inventory-counts/${id}`);
}

export function addInventoryLine(
    countId: number,
    request: {
        productId: number;
        expectedQuantity: number;
        actualQuantity: number;
        varianceReason: string | null;
    },
): Promise<InventoryCount> {
    return apiRequest<InventoryCount>(`/api/inventory-counts/${countId}/lines`, {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export function updateInventoryLine(
    countId: number,
    lineId: number,
    request: {
        expectedQuantity: number;
        actualQuantity: number;
        varianceReason: string | null;
    },
): Promise<InventoryCount> {
    return apiRequest<InventoryCount>(`/api/inventory-counts/${countId}/lines/${lineId}`, {
        method: "PUT",
        body: JSON.stringify(request),
    });
}

export function finalizeInventoryCount(countId: number): Promise<void> {
    return apiRequest<void>(`/api/inventory-counts/${countId}/finalize`, {
        method: "POST",
    });
}
