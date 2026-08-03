export type Product = {
    id: number;
    name: string;
    sku: string;
    isActive: boolean;
};

export type CreateProductRequest = {
    name: string;
    sku: string;
};

export type InventoryCountLine = {
    id: number;
    productId: number;
    productName: string;
    expectedQuantity: number;
    actualQuantity: number;
    variance: number;
    varianceReason: string | null;
};

export type InventoryCount = {
    id: number;
    countDate: string;
    status: string;
    finalizedAt: string | null;
    lines: InventoryCountLine[];
};