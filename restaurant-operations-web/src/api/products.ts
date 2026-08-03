import { apiRequest } from "./http";
import type { CreateProductRequest, Product } from "../types/api";

export function getProducts(): Promise<Product[]> {
    return apiRequest<Product[]>("/api/products");
}

export function createProduct(
    request: CreateProductRequest,
): Promise<Product> {
    return apiRequest<Product>("/api/products", {
        method: "POST",
        body: JSON.stringify(request),
    });
}