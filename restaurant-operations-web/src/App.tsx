import { useState } from "react";
import "./App.css";
import { InventoryCountPage } from "./pages/InventoryCountPage";
import { ProductsPage } from "./pages/ProductsPage";

type ActivePage = "products" | "inventory";

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

                {activePage === "products" ? (
                    <ProductsPage />
                ) : (
                    <InventoryCountPage />
                )}
            </main>
        </div>
    );
}