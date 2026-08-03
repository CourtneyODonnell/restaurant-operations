/* eslint-disable react-hooks/set-state-in-effect */
// src/pages/ProductsPage.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createProduct, getProducts } from "../api/products";
import type { Product } from "../types/api";

//refactored components imports
import { ErrorBanner } from "../components/ErrorBanner";
import { ProductTable } from "../components/ProductTable";
import { ProductForm } from "../components/ProductForm";

export function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState("");
    const [sku, setSku] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadProducts() {
        try {
            const loadedProducts = await getProducts();
            setProducts(loadedProducts);
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Request failed.",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadProducts();
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setError(null);
            await createProduct({ name, sku });
            setName("");
            setSku("");
            await loadProducts();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Request failed.");
        }
    }

    return (
        <section>
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Catalog</p>
                    <h2>Products</h2>
                </div>
            </div>

            <ProductForm
                name={name}
                sku={sku}
                onNameChange={setName}
                onSkuChange={setSku}
                onSubmit={handleSubmit}
            />
            
            {error && <ErrorBanner message={error} />}
            {loading ? (
                <p>Loading products…</p>
            ) : (
                <ProductTable products={products} />
      
                
            )}
        </section>
    );
}
