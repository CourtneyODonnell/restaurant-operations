import { useState } from "react";
import "./App.css";
import { InventoryCountPage } from "./pages/InventoryCountPage";
import { ProductsPage } from "./pages/ProductsPage";
import { TapeCalculatorPage } from "./pages/TapeCalculatorPage";

type ActivePage = "products" | "inventory" | "calculator";

export default function App() {
    const [activePage, setActivePage] = useState<ActivePage>("products");

    return (
        <div className="app-shell">
            <header className="app-header">
                <div>
                    <p className="eyebrow">Restaurant Operations</p>
                    <h1>Inventory Control</h1>
                </div>
            </header>

            <main className="app-content">
                <nav className="nav-tabs" aria-label="Main navigation">
                    <button
                        type="button"
                        className={activePage === "products" ? "active" : ""}
                        onClick={() => setActivePage("products")}
                    >
                        Products
                    </button>

                    <button
                        type="button"
                        className={activePage === "inventory" ? "active" : ""}
                        onClick={() => setActivePage("inventory")}
                    >
                        Inventory Count
                    </button>
                </nav>

                <button
                    type="button"
                    className={activePage === "calculator" ? "active" : ""}
                    onClick={() => setActivePage("calculator")}
                >
                    Tape Calculator
                </button>

                {activePage === "products" && <ProductsPage />}

                {activePage === "inventory" && <InventoryCountPage />}

                {activePage === "calculator" && <TapeCalculatorPage />}
            </main>
        </div>
    );
}