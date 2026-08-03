import type { FormEvent } from "react";
import type { Product } from "../types/api";

type InventoryLineFormProps = {
    products: Product[];
    selectedProductId: string;
    expectedQuantity: string;
    actualQuantity: string;
    varianceReason: string;
    onSelectedProductIdChange: (value: string) => void;
    onExpectedQuantityChange: (value: string) => void;
    onActualQuantityChange: (value: string) => void;
    onVarianceReasonChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function InventoryLineForm({
    products,
    selectedProductId,
    expectedQuantity,
    actualQuantity,
    varianceReason,
    onSelectedProductIdChange,
    onExpectedQuantityChange,
    onActualQuantityChange,
    onVarianceReasonChange,
    onSubmit,
}: InventoryLineFormProps) {
    return (
        <form className="card" onSubmit={onSubmit}>
            <h3>Add inventory line</h3>

            <label>
                Product
                <select
                    value={selectedProductId}
                    onChange={(event) =>
                        onSelectedProductIdChange(event.target.value)
                    }
                    required
                >
                    <option value="">Select a product</option>

                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Expected quantity
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={expectedQuantity}
                    onChange={(event) =>
                        onExpectedQuantityChange(event.target.value)
                    }
                    required
                />
            </label>

            <label>
                Actual quantity
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={actualQuantity}
                    onChange={(event) =>
                        onActualQuantityChange(event.target.value)
                    }
                    required
                />
            </label>

            <label>
                Variance reason
                <textarea
                    value={varianceReason}
                    onChange={(event) =>
                        onVarianceReasonChange(event.target.value)
                    }
                    maxLength={500}
                />
            </label>

            <button type="submit">Add line</button>
        </form>
    );
}