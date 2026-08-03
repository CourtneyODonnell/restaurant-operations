type StartInventoryCountProps = {
    onStart: () => void;
};

export function StartInventoryCount({
    onStart,
}: StartInventoryCountProps) {
    return (
        <button type="button" onClick={onStart}>
            Start count
        </button>
    );
}