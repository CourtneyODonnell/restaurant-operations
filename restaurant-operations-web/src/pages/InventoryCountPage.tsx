import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
    addInventoryLine,
    createInventoryCount,
    finalizeInventoryCount,
    getInventoryCount,
    getInventoryCounts,
    updateInventoryLine,
} from "../api/inventoryCounts";

import { getProducts } from "../api/products";

import type {
    InventoryCount,
    Product,
} from "../types/api";

import { ErrorBanner } from "../components/ErrorBanner";
import { StatusBadge } from "../components/StatusBadge";
import { StartInventoryCount } from "../components/StartInventoryCount";
import { InventoryLineTable } from "../components/InventoryLineTable";
import { InventoryLineForm } from "../components/InventoryLineForm";

export function InventoryCountPage() {
    const [count, setCount] =
        useState<InventoryCount | null>(null);

    const [counts, setCounts] =
        useState<InventoryCount[]>([]);

    const [loadingCounts, setLoadingCounts] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [products, setProducts] =
        useState<Product[]>([]);

    const [selectedProductId, setSelectedProductId] =
        useState("");

    const [expectedQuantity, setExpectedQuantity] =
        useState("");

    const [actualQuantity, setActualQuantity] =
        useState("");

    const [varianceReason, setVarianceReason] =
        useState("");

    const [editingLineId, setEditingLineId] =
        useState<number | null>(null);

    const [editExpectedQuantity, setEditExpectedQuantity] =
        useState("");

    const [editActualQuantity, setEditActualQuantity] =
        useState("");

    const [editVarianceReason, setEditVarianceReason] =
        useState("");

    async function loadCounts() {
        try {
            setLoadingCounts(true);

            const loadedCounts =
                await getInventoryCounts();

            setCounts(loadedCounts);
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Could not load inventory counts.",
            );
        } finally {
            setLoadingCounts(false);
        }
    }

    useEffect(() => {
        async function loadInitialData() {
            try {
                setError(null);

                const [
                    loadedProducts,
                    loadedCounts,
                ] = await Promise.all([
                    getProducts(),
                    getInventoryCounts(),
                ]);

                setProducts(loadedProducts);
                setCounts(loadedCounts);
            } catch (requestError) {
                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "Could not load inventory data.",
                );
            } finally {
                setLoadingCounts(false);
            }
        }

        void loadInitialData();
    }, []);

    async function handleCreateCount() {
        try {
            setError(null);

            const created =
                await createInventoryCount(
                    new Date().toISOString(),
                );

            setCount(created);
            await loadCounts();
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Request failed.",
            );
        }
    }

    async function handleOpenCount(countId: number) {
        try {
            setError(null);

            const selectedCount =
                await getInventoryCount(countId);

            setCount(selectedCount);
            setEditingLineId(null);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Could not open inventory count.",
            );
        }
    }

    function handleCloseCount() {
        setCount(null);
        setEditingLineId(null);
        setEditExpectedQuantity("");
        setEditActualQuantity("");
        setEditVarianceReason("");

        void loadCounts();
    }

    async function handleAddLine(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!count) {
            return;
        }

        try {
            setError(null);

            const updatedCount =
                await addInventoryLine(count.id, {
                    productId:
                        Number(selectedProductId),

                    expectedQuantity:
                        Number(expectedQuantity),

                    actualQuantity:
                        Number(actualQuantity),

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

            await loadCounts();
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

        const line = count.lines.find(
            (item) => item.id === lineId,
        );

        if (!line) {
            return;
        }

        setEditingLineId(line.id);

        setEditExpectedQuantity(
            line.expectedQuantity.toString(),
        );

        setEditActualQuantity(
            line.actualQuantity.toString(),
        );

        setEditVarianceReason(
            line.varianceReason ?? "",
        );
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

            const updatedCount =
                await updateInventoryLine(
                    count.id,
                    editingLineId,
                    {
                        expectedQuantity:
                            Number(
                                editExpectedQuantity,
                            ),

                        actualQuantity:
                            Number(
                                editActualQuantity,
                            ),

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

            await loadCounts();
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

            const refreshedCount =
                await getInventoryCount(count.id);

            setCount(refreshedCount);

            setEditingLineId(null);
            setEditExpectedQuantity("");
            setEditActualQuantity("");
            setEditVarianceReason("");

            await loadCounts();
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
                    <p className="eyebrow">
                        Inventory
                    </p>

                    <h2>Inventory Counts</h2>
                </div>
            </div>

            {error && (
                <ErrorBanner message={error} />
            )}

            {count ? (
                <>
                    <div className="count-detail-toolbar">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={handleCloseCount}
                        >
                            ← Back to all counts
                        </button>
                    </div>

                    <div className="card count-summary-card">
                        <div>
                            <p className="eyebrow">
                                Inventory count
                            </p>

                            <h3>
                                Count #{count.id}
                            </h3>
                        </div>

                        <StatusBadge
                            status={
                                count.status === "Finalized"
                                    ? "Locked"
                                    : "Draft"
                            }
                        />

                        <div className="count-summary-details">
                            <p>
                                <strong>Created:</strong>{" "}
                                {new Date(
                                    count.countDate,
                                ).toLocaleString()}
                            </p>

                            <p>
                                <strong>Lines:</strong>{" "}
                                {count.lines.length}
                            </p>

                            {count.finalizedAt && (
                                <p>
                                    <strong>
                                        Finalized:
                                    </strong>{" "}
                                    {new Date(
                                        count.finalizedAt,
                                    ).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>

                    <InventoryLineTable
                        lines={count.lines}
                        isDraft={
                            count.status === "Draft"
                        }
                        onEdit={handleEditLine}
                    />

                    {count.status === "Draft" && (
                        <button
                            type="button"
                            onClick={handleFinalize}
                            disabled={
                                count.lines.length === 0
                            }
                        >
                            Finalize count
                        </button>
                    )}

                    {count.status ===
                        "Finalized" && (
                            <div className="card locked-message">
                                <strong>
                                    Locked
                                </strong>

                                <p>
                                    This inventory count has
                                    been finalized and can no
                                    longer be edited.
                                </p>
                            </div>
                        )}

                    {count.status === "Draft" && (
                        <InventoryLineForm
                            products={products}
                            selectedProductId={
                                selectedProductId
                            }
                            expectedQuantity={
                                expectedQuantity
                            }
                            actualQuantity={
                                actualQuantity
                            }
                            varianceReason={
                                varianceReason
                            }
                            onSelectedProductIdChange={
                                setSelectedProductId
                            }
                            onExpectedQuantityChange={
                                setExpectedQuantity
                            }
                            onActualQuantityChange={
                                setActualQuantity
                            }
                            onVarianceReasonChange={
                                setVarianceReason
                            }
                            onSubmit={handleAddLine}
                        />
                    )}

                    {count.status === "Draft" &&
                        editingLineId !== null && (
                            <form
                                className="card"
                                onSubmit={handleSaveEdit}
                            >
                                <h3>
                                    Edit inventory line
                                </h3>

                                <label>
                                    Expected quantity
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            editExpectedQuantity
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setEditExpectedQuantity(
                                                event
                                                    .target
                                                    .value,
                                            )
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
                                        value={
                                            editActualQuantity
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setEditActualQuantity(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        required
                                    />
                                </label>

                                <label>
                                    Variance reason
                                    <textarea
                                        value={
                                            editVarianceReason
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setEditVarianceReason(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        maxLength={500}
                                    />
                                </label>

                                <div className="form-actions">
                                    <button type="submit">
                                        Save changes
                                    </button>

                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() => {
                                            setEditingLineId(
                                                null,
                                            );

                                            setEditExpectedQuantity(
                                                "",
                                            );

                                            setEditActualQuantity(
                                                "",
                                            );

                                            setEditVarianceReason(
                                                "",
                                            );
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                </>
            ) : (
                <>
                        <div className="inventory-actions">
                            <div>
                                <p className="eyebrow">History</p>
                                <h3>Past inventory counts</h3>
                            </div>

                            <div className="inventory-action-buttons">
                                <button
                                    type="button"
                                    onClick={handleCreateCount}
                                >
                                    Start count
                                </button>

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => void loadCounts()}
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>

                    

                    {loadingCounts ? (
                        <p>
                            Loading inventory counts…
                        </p>
                    ) : counts.length === 0 ? (
                        <div className="card">
                            <p>
                                No inventory counts have
                                been created yet.
                            </p>
                        </div>
                    ) : (
                        <div className="inventory-count-grid">
                            {counts.map(
                                (inventoryCount) => {
                                    const isLocked =
                                        inventoryCount.status ===
                                        "Finalized";

                                    return (
                                        <button
                                            key={
                                                inventoryCount.id
                                            }
                                            type="button"
                                            className="inventory-count-card"
                                            onClick={() =>
                                                void handleOpenCount(
                                                    inventoryCount.id,
                                                )
                                            }
                                        >
                                            <span className="inventory-count-card-icon">
                                                {isLocked
                                                    ? "✓"
                                                    : "✎"}
                                            </span>

                                            <span className="inventory-count-card-content">
                                                <span className="inventory-count-card-top">
                                                    <strong>
                                                        Count #
                                                        {
                                                            inventoryCount.id
                                                        }
                                                    </strong>

                                                    <StatusBadge
                                                        status={
                                                            isLocked
                                                                ? "Locked"
                                                                : "Draft"
                                                        }
                                                    />
                                                </span>

                                                <span className="inventory-count-card-meta">
                                                    {new Date(
                                                        inventoryCount.countDate,
                                                    ).toLocaleString()}
                                                </span>

                                                <span className="inventory-count-card-meta">
                                                    {
                                                        inventoryCount
                                                            .lines
                                                            .length
                                                    }{" "}
                                                    inventory{" "}
                                                    {inventoryCount
                                                        .lines
                                                        .length ===
                                                        1
                                                        ? "line"
                                                        : "lines"}
                                                </span>

                                                {inventoryCount.finalizedAt && (
                                                    <span className="inventory-count-card-meta">
                                                        Finalized{" "}
                                                        {new Date(
                                                            inventoryCount.finalizedAt,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </span>

                                            <span className="inventory-count-card-arrow">
                                                →
                                            </span>
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}