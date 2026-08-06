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
                    {products.map((product) => {
                        const status = product.isActive
                            ? "active"
                            : "inactive";

                        return (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.sku}</td>
                                <td>
                                    <span
                                        className={`status-badge ${status}`}
                                    >
                                        {product.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}