import type { FormEvent } from "react";

type ProductFormProps = {
    name: string;
    sku: string;
    onNameChange: (value: string) => void;
    onSkuChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ProductForm({
    name,
    sku,
    onNameChange,
    onSkuChange,
    onSubmit,
}: ProductFormProps) {
    return (
        <form className="card form-grid" onSubmit={onSubmit}>
            <label>
                Product name
                <input
                    value={name}
                    onChange={(event) =>
                        onNameChange(event.target.value)
                    }
                    required
                    maxLength={200}
                />
            </label>

            <label>
                SKU
                <input
                    value={sku}
                    onChange={(event) =>
                        onSkuChange(event.target.value)
                    }
                    required
                    maxLength={50}
                />
            </label>

            <button type="submit">Add product</button>
        </form>
    );
}