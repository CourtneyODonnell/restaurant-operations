import type { InventoryCountLine } from "../types/api";

type InventoryLineTableProps = {
    lines: InventoryCountLine[];
    isDraft: boolean;
    onEdit: (lineId: number) => void;
};

export function InventoryLineTable({
    lines,
    isDraft,
    onEdit,
}: InventoryLineTableProps) {
    return (
        <div className="card table-wrap">
            <h3>Count lines</h3>

            {lines.length === 0 ? (
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

                            {isDraft && <th>Actions</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {lines.map((line) => (
                            <tr key={line.id}>
                                <td>{line.productName}</td>
                                <td>{line.expectedQuantity}</td>
                                <td>{line.actualQuantity}</td>

                                <td
                                    className={
                                        line.variance === 0
                                            ? ""
                                            : "variance-alert"
                                    }
                                >
                                    {line.variance}
                                </td>

                                <td>{line.varianceReason ?? "—"}</td>

                                {isDraft && (
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => onEdit(line.id)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}