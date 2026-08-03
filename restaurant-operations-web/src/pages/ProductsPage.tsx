// src/pages/ProductsPage.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createProduct, getProducts } from "../api/products";
import type { Product } from "../types/api";

export function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState("");
    const [sku, setSku] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadProducts() {
        try {
            setError(null);
            setProducts(await getProducts());
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Request failed.");
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

            <form className="card form-grid" onSubmit={handleSubmit}>
                <label>
                    Product name
                    <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={200} />
                </label>
                <label>
                    SKU
                    <input value={sku} onChange={(event) => setSku(event.target.value)} required maxLength={50} />
                </label>
                <button type="submit">Add product</button>
            </form>

            {error && <div className="error-banner">{error}</div>}
            {loading ? (
                <p>Loading products…</p>
            ) : (
                <div className="card table-wrap">
                    <table>
                        <thead><tr><th>Name</th><th>SKU</th><th>Status</th></tr></thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.sku}</td>
                                    <td>{product.isActive ? "Active" : "Inactive"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
