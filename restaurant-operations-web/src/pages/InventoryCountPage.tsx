import { useEffect, useState } from "react";
import type { FormEvent } from "react";
// Import API functions
import {
    addInventoryLine,
    createInventoryCount,
    finalizeInventoryCount,
    getInventoryCount,
    updateInventoryLine,
} from "../api/inventoryCounts";
// Import getProducts function
import { getProducts } from "../api/products";
// Import types
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
    const [editExpectedQuantity, setEditExpectedQuantity] = useState("");
    const [editActualQuantity, setEditActualQuantity] = useState("");
    const [editVarianceReason, setEditVarianceReason] = useState("");

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
        setEditExpectedQuantity(line.expectedQuantity.toString());
        setEditActualQuantity(line.actualQuantity.toString());
        setEditVarianceReason(line.varianceReason ?? "");
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
                    expectedQuantity: Number(editExpectedQuantity),
                    actualQuantity: Number(editActualQuantity),
                    varianceReason:
                        editVarianceReason.trim() === ""
                            ? null
                            : editVarianceReason.trim(),
                },
            );

            setCount(updatedCount);
            setEditingLineId(null);
            setEditExpectedQuantity("");
            setEditActualQuantity("");
            setEditVarianceReason("");
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Could not update inventory line.",
            );
        }
    }

    async function handleFinalize() {
        if (!count) {
            return;
        }

        try {
            setError(null);

            await finalizeInventoryCount(count.id);

            const refreshedCount = await getInventoryCount(count.id);
            setCount(refreshedCount);

            setEditingLineId(null);
            setEditExpectedQuantity("");
            setEditActualQuantity("");
            setEditVarianceReason("");
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Could not finalize inventory count.",
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
                            {count.finalizedAt && (
                                <p>
                                    <strong>Finalized:</strong>{" "}
                                    {new Date(count.finalizedAt).toLocaleString()}
                                </p>
                            )}

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
                                                {count.status === "Draft" && <th>Actions</th>}
                                    </tr>
                                </thead>
                                        {/* table body */}
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
                                                {count.status === "Draft" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditLine(line.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                        

                                    ))}
                                    </tbody>

                            </table>
                        )}
                        </div>
                        {/* finalize button */}
                        {
                            count.status === "Draft" && (
                                <button
                                    type="button"
                                    onClick={handleFinalize}
                                    disabled={count.lines.length === 0}
                                >
                                    Finalize count
                                </button>
                            )
                        }

                        {count.status === "Finalized" && (
                            <div className="card">
                                <strong>Finalized and locked</strong>
                                <p>This inventory count can no longer be edited.</p>
                            </div>
                        )}


                        {count.status === "Draft" && (

                       
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
                        )}

                        {/* edit form */}
                        {count.status === "Draft" && editingLineId !== null && (
                            <form className="card" onSubmit={handleSaveEdit}>
                                <h3>Edit inventory line</h3>

                                <label>
                                    Expected quantity
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editExpectedQuantity}
                                        onChange={(event) =>
                                            setEditExpectedQuantity(event.target.value)
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
                                        value={editActualQuantity}
                                        onChange={(event) =>
                                            setEditActualQuantity(event.target.value)
                                        }
                                        required
                                    />
                                </label>

                                <label>
                                    Variance reason
                                    <textarea
                                        value={editVarianceReason}
                                        onChange={(event) =>
                                            setEditVarianceReason(event.target.value)
                                        }
                                        maxLength={500}
                                    />
                                </label>

                                <button type="submit">Save changes</button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingLineId(null);
                                        setEditExpectedQuantity("");
                                        setEditActualQuantity("");
                                        setEditVarianceReason("");
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