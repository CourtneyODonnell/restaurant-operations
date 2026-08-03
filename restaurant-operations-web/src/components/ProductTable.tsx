import type { Product } from "../types/api";

type ProductTableProps = {
    products: Product[];
};

export function ProductTable({
    products,
}: ProductTableProps) {
    if (products.length === 0) {
        return <p>No products have been created yet.</p>;
    }

    return (
        <div className="card table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.sku}</td>
                            <td>
                                {product.isActive ? "Active" : "Inactive"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}