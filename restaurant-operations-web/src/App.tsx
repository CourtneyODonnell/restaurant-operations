import "./App.css";
import { InventoryCountPage } from "./pages/InventoryCountPage";

export default function App() {
    return (
        <div className="app-shell">
            <header className="app-header">
                <div>
                    <p className="eyebrow">Restaurant Operations</p>
                    <h1>Inventory Control</h1>
                </div>
            </header>

            <main className="app-content">
                <InventoryCountPage />
            </main>
        </div>
    );
}