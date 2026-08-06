import { useState } from "react";
import "./App.css";
import { InventoryCountPage } from "./pages/InventoryCountPage";
import { ProductsPage } from "./pages/ProductsPage";
import { TapeCalculatorPage } from "./pages/TapeCalculatorPage";

type ActivePage = "products" | "inventory" | "calculator";

type NavigationItem = {
    id: ActivePage;
    title: string;
    description: string;
    icon: "products" | "inventory" | "calculator";
};

const navigationItems: NavigationItem[] = [
    {
        id: "products",
        title: "Products",
        description: "View and maintain the shared product catalog.",
        icon: "products",
    },
    {
        id: "inventory",
        title: "Inventory Counts",
        description: "Create, update, and finalize inventory counts.",
        icon: "inventory",
    },
    {
        id: "calculator",
        title: "Tape Calculator",
        description: "Calculate combined register totals.",
        icon: "calculator",
    },
];

export default function App() {
    const [activePage, setActivePage] =
        useState<ActivePage>("products");

    const activeItem =
        navigationItems.find((item) => item.id === activePage) ??
        navigationItems[0];

    return (
        <div className="app-shell">
            <header className="app-header compact-header">
                <div className="compact-header-content">
                    <div className="brand-row compact-brand-row">
                        <div className="brand-mark" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                        </div>

                        <div>
                            <p className="hero-brand">
                                Restaurant Operations
                            </p>
                            <p className="compact-header-subtitle">
                                Inventory Management
                            </p>
                        </div>
                    </div>

                    
                </div>
            </header>

            <main className="app-content">
                <section
                    className="quick-actions-section"
                    aria-labelledby="navigation-title"
                >
                    <div className="dashboard-heading">
                        <div>
                            <p className="eyebrow">Operations</p>
                            <h1 id="navigation-title">
                                Select a workspace
                            </h1>
                        </div>

                        <p className="page-introduction">
                            Manage products, inventory counts, and daily
                            register totals.
                        </p>
                    </div>

                    <nav
                        className="feature-grid"
                        aria-label="Main navigation"
                    >
                        {navigationItems.map((item) => {
                            const isActive = item.id === activePage;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`feature-card${isActive ? " active" : ""
                                        }`}
                                    aria-pressed={isActive}
                                    onClick={() =>
                                        setActivePage(item.id)
                                    }
                                >
                                    <span className="feature-icon">
                                        <FeatureIcon name={item.icon} />
                                    </span>

                                    <span className="feature-copy">
                                        <strong>{item.title}</strong>

                                        <span className="feature-description">
                                            {item.description}
                                        </span>
                                    </span>

                                    <span
                                        className="feature-arrow"
                                        aria-hidden="true"
                                    >
                                        →
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </section>

                <section
                    className="workspace-shell"
                    aria-labelledby="workspace-title"
                >
                    <div className="workspace-header">
                        <div className="workspace-title-group">
                            <span className="workspace-icon">
                                <FeatureIcon name={activeItem.icon} />
                            </span>

                            <div>
                                <p className="eyebrow">
                                    Current workspace
                                </p>
                                <h2 id="workspace-title">
                                    {activeItem.title}
                                </h2>
                            </div>
                        </div>

                        <p className="workspace-description">
                            {activeItem.description}
                        </p>
                    </div>

                    <div className="workspace-content">
                        {activePage === "products" && (
                            <ProductsPage />
                        )}

                        {activePage === "inventory" && (
                            <InventoryCountPage />
                        )}

                        {activePage === "calculator" && (
                            <TapeCalculatorPage />
                        )}
                    </div>
                </section>

                <footer className="app-footer">
                    <div>
                        <strong>Restaurant Operations</strong>
                        <span>
                            ASP.NET Core • React • SQL Server
                        </span>
                    </div>

                    <span className="footer-pill">
                        Development environment
                    </span>
                </footer>
            </main>
        </div>
    );
}

function FeatureIcon({
    name,
}: {
    name: "products" | "inventory" | "calculator";
}) {
    if (name === "products") {
        return (
            <svg
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
            >
                <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
                <path d="m4.5 7.5 7.5 4 7.5-4" />
                <path d="M12 11.5V21" />
            </svg>
        );
    }

    if (name === "inventory") {
        return (
            <svg
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
            >
                <rect x="5" y="4" width="14" height="16" rx="2" />
                <path d="M9 4.5h6" />
                <path d="m8.5 10 1.5 1.5 3-3" />
                <path d="M14 11h2.5" />
                <path d="m8.5 15 1.5 1.5 3-3" />
                <path d="M14 16h2.5" />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
        >
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M8 7h8" />
            <path d="M8 11h2" />
            <path d="M14 11h2" />
            <path d="M8 15h2" />
            <path d="M14 15h2" />
            <path d="M11 11h2" />
            <path d="M11 15h2" />
        </svg>
    );
}