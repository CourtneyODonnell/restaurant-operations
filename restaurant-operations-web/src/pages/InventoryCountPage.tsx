import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
    addInventoryLine,
    createInventoryCount,
    updateInventoryLine,
} from "../api/inventoryCounts";
import { getProducts } from "../api/products";

import type {
    InventoryCount,
    Product,
} from "../types/api";


export function InventoryCountPage() {

    //State variables
    const [count, setCount] = useState<InventoryCount | null>(null);
    const [error, setError] = useState<string | null>(null);

    //New state
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [expectedQuantity, setExpectedQuantity] = useState("");
    const [actualQuantity, setActualQuantity] = useState("");
    const [varianceReason, setVarianceReason] = useState("");
    //edit state
    const [editingLineId, setEditingLineId] = useState<number | null>(null);

    //useeffect to load products

    useEffect(() => {
        async function loadProducts() {
            try {
                setError(null);
                const loadedProducts = await getProducts();
                setProducts(loadedProducts);
            } catch (requestError) {
                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "Could not load products.",
                );
            }
        }

        void loadProducts();
    }, []);

    //OG handler 
    async function handleCreateCount() {
        try {
            setError(null);

            const created = await createInventoryCount(
                new Date().toISOString(),
            );

            setCount(created);
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Request failed.",
            );
        }
    }

    //submit handler for adding inventory line

    async function handleAddLine(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!count) {
            return;
        }

        try {
            setError(null);

            const updatedCount = await addInventoryLine(count.id, {
                productId: Number(selectedProductId),
                expectedQuantity: Number(expectedQuantity),
                actualQuantity: Number(actualQuantity),
                varianceReason:
                    varianceReason.trim() === ""
                        ? null
                        : varianceReason.trim(),
            });

            setCount(updatedCount);

            setSelectedProductId("");
            setExpectedQuantity("");
            setActualQuantity("");
            setVarianceReason("");
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Could not add inventory line.",
            );
        }
    }

    function handleEditLine(lineId: number) {
        if (!count) {
            return;
        }

        const line = count.lines.find((item) => item.id === lineId);

        if (!line) {
            return;
        }

        setEditingLineId(line.id);
        setExpectedQuantity(line.expectedQuantity.toString());
        setActualQuantity(line.actualQuantity.toString());
        setVarianceReason(line.varianceReason ?? "");
    }

    async function handleSaveEdit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!count || editingLineId === null) {
            return;
        }

        try {
            setError(null);

            const updatedCount = await updateInventoryLine(
                count.id,
                editingLineId,
                {
                    expectedQuantity: Number(expectedQuantity),
                    actualQuantity: Number(actualQuantity),
                    varianceReason:
                        varianceReason.trim() === ""
                            ? null
                            : varianceReason.trim(),
                },
            );

            setCount(updatedCount);
            setEditingLineId(null);
            setExpectedQuantity("");
            setActualQuantity("");
            setVarianceReason("");
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Could not update inventory line.",
            );
        }
    }

    return (
        <section>
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Inventory</p>
                    <h2>Inventory Count</h2>
                </div>
            </div>

            {!count ? (
                <button type="button" onClick={handleCreateCount}>
                    Start count
                </button>
) : (
  <>
    <div className="card">
      <p>
        <strong>Count ID:</strong> {count.id}
      </p>
      <p>
        <strong>Status:</strong> {count.status}
      </p>
      <p>
        <strong>Count date:</strong>{" "}
        {new Date(count.countDate).toLocaleString()}
      </p>
    </div>
                        <div className="card table-wrap">
                            <h3>Count lines</h3>

                            {count.lines.length === 0 ? (
                                <p>No inventory lines have been added yet.</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Expected</th>
                                            <th>Actual</th>
                                            <th>Variance</th>
                                            <th>Reason</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {count.lines.map((line) => (
                                            <tr key={line.id}>
                                                <td>{line.productName}</td>
                                                <td>{line.expectedQuantity}</td>
                                                <td>{line.actualQuantity}</td>
                                                <td className={line.variance === 0 ? "" : "variance-alert"}>
                                                    {line.variance}
                                                </td>
                                                <td>{line.varianceReason ?? "—"}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditLine(line.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <form className="card" onSubmit={handleAddLine}>
                            
      <h3>Add inventory line</h3>

      <label>
        Product
        <select
          value={selectedProductId}
          onChange={(event) =>
            setSelectedProductId(event.target.value)
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
            setExpectedQuantity(event.target.value)
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
            setActualQuantity(event.target.value)
          }
          required
        />
      </label>

      <label>
        Variance reason
        <textarea
          value={varianceReason}
          onChange={(event) =>
            setVarianceReason(event.target.value)
          }
          maxLength={500}
        />
      </label>

      <button type="submit">Add line</button>
                        </form>
                        {/* add edit form */}
                        {editingLineId !== null && (
                            <form className="card" onSubmit={handleSaveEdit}>
                                <h3>Edit inventory line</h3>

                                <label>
                                    Expected quantity
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={expectedQuantity}
                                        onChange={(event) =>
                                            setExpectedQuantity(event.target.value)
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
                                            setActualQuantity(event.target.value)
                                        }
                                        required
                                    />
                                </label>

                                <label>
                                    Variance reason
                                    <textarea
                                        value={varianceReason}
                                        onChange={(event) =>
                                            setVarianceReason(event.target.value)
                                        }
                                        maxLength={500}
                                    />
                                </label>

                                <button type="submit">Save changes</button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingLineId(null);
                                        setExpectedQuantity("");
                                        setActualQuantity("");
                                        setVarianceReason("");
                                    }}
                                >
                                    Cancel
                                </button>
                            </form>
                        )}




                </>
            )}
            {error && <div className="error-banner">{error}</div>}
        </section>
    );
}