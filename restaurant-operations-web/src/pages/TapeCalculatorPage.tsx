import { useState } from "react";

type TapeValues = {
    debit: string;
    credit: string;
    mobile: string;
};

const emptyTape: TapeValues = {
    debit: "",
    credit: "",
    mobile: "",
};

export function TapeCalculatorPage() {
    const [tapeOne, setTapeOne] = useState<TapeValues>(emptyTape);
    const [tapeTwo, setTapeTwo] = useState<TapeValues>(emptyTape);
    const [showResults, setShowResults] = useState(false);

    const debitTotal =
        Number(tapeOne.debit || 0) + Number(tapeTwo.debit || 0);

    const creditTotal =
        Number(tapeOne.credit || 0) + Number(tapeTwo.credit || 0);

    const mobileTotal =
        Number(tapeOne.mobile || 0) + Number(tapeTwo.mobile || 0);

    function updateTape(
        setter: React.Dispatch<React.SetStateAction<TapeValues>>,
        field: keyof TapeValues,
        value: string,
    ) {
        setter((current) => ({
            ...current,
            [field]: value,
        }));

        setShowResults(false);
    }

    return (
        <section>
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Operations utility</p>
                    <h2>Tape Calculator</h2>
                </div>
            </div>

            <div className="calculator-grid">
                <div className="card">
                    <h3>Tape 1</h3>

                    <label>
                        Debit
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={tapeOne.debit}
                            onChange={(event) =>
                                updateTape(
                                    setTapeOne,
                                    "debit",
                                    event.target.value,
                                )
                            }
                        />
                    </label>

                    <label>
                        Credit
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={tapeOne.credit}
                            onChange={(event) =>
                                updateTape(
                                    setTapeOne,
                                    "credit",
                                    event.target.value,
                                )
                            }
                        />
                    </label>

                    <label>
                        Mobile
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={tapeOne.mobile}
                            onChange={(event) =>
                                updateTape(
                                    setTapeOne,
                                    "mobile",
                                    event.target.value,
                                )
                            }
                        />
                    </label>
                </div>

                <div className="card">
                    <h3>Tape 2</h3>

                    <label>
                        Debit
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={tapeTwo.debit}
                            onChange={(event) =>
                                updateTape(
                                    setTapeTwo,
                                    "debit",
                                    event.target.value,
                                )
                            }
                        />
                    </label>

                    <label>
                        Credit
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={tapeTwo.credit}
                            onChange={(event) =>
                                updateTape(
                                    setTapeTwo,
                                    "credit",
                                    event.target.value,
                                )
                            }
                        />
                    </label>

                    <label>
                        Mobile
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={tapeTwo.mobile}
                            onChange={(event) =>
                                updateTape(
                                    setTapeTwo,
                                    "mobile",
                                    event.target.value,
                                )
                            }
                        />
                    </label>
                </div>
            </div>

            <button
                type="button"
                onClick={() => setShowResults(true)}
            >
                Calculate totals
            </button>

            {showResults && (
                <div className="card calculator-results">
                    <h3>Combined totals</h3>
                    <p><strong>Debit:</strong> {debitTotal}</p>
                    <p><strong>Credit:</strong> {creditTotal}</p>
                    <p><strong>Mobile:</strong> {mobileTotal}</p>
                </div>
            )}
        </section>
    );
}