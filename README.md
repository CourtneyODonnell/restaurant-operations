# Restaurant Operations API

> A full-stack restaurant inventory management platform built with **ASP.NET Core 8**, **Entity Framework Core**, **SQL Server**, **React**, and **Flutter**.

Restaurant Operations is a portfolio project that demonstrates the design of a modern multi-client application. The solution consists of a React administrative portal and a Flutter mobile companion, both consuming a shared ASP.NET Core Web API.

The API serves as the **single source of truth**, enforcing inventory business rules, validating requests, and persisting data through Entity Framework Core and SQL Server.

---

# Architecture

```
                    React Administrative Portal
                              │
                              │
                              │ REST API
                              │
                 ASP.NET Core Web API (.NET 8)
        Controllers • Services • Validation • DTOs
                              │
                      Entity Framework Core
                              │
                        SQL Server Database
                              │
               Shared Business Rules & Persistence
                              │
                   Flutter Mobile Companion
```

The React and Flutter applications never calculate inventory business rules independently. Both clients submit requests to the API, which validates, processes, and returns the authoritative result.

---

# Features

## Web Portal (React)

- Product management
- Inventory count management
- Inventory count details
- Add inventory lines
- Edit inventory lines
- Finalize inventory counts
- Tape calculator utility
- Responsive user interface

---

## Mobile Companion (Flutter)

- Dashboard
- Product browser
- Inventory count list
- Inventory count details
- Add inventory lines
- Edit inventory lines
- Finalize inventory counts
- Shared backend integration

---

## ASP.NET Core API

- RESTful API
- Product endpoints
- Inventory Count endpoints
- Inventory Line endpoints
- Validation
- Business rule enforcement
- Swagger / OpenAPI documentation

---

# Technology Stack

## Backend

- ASP.NET Core 8
- Entity Framework Core
- SQL Server
- LINQ
- Dependency Injection

## Frontend

- React
- TypeScript
- Vite

## Mobile

- Flutter
- Dart

## Development

- Git
- GitHub
- Swagger
- Visual Studio
- VS Code

---

# Business Rules

The API owns all inventory business logic.

Implemented rules include:

- Inventory variance is calculated by the API
- A variance reason is required when expected and actual quantities differ
- A product cannot appear twice within the same inventory count
- Finalized inventory counts become read-only
- React and Flutter display backend-calculated values instead of implementing duplicate logic

By centralizing business rules, every client remains consistent and future clients can be added without rewriting validation logic.

---

# Project Structure

```
RestaurantOperations
│
├── RestaurantOperations.Api
│
├── RestaurantOperations.Tests
│
└── restaurant-operations-web
```

---

# API Endpoints

## Products

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Retrieve all products |
| GET | `/api/products/{id}` | Retrieve a single product |
| POST | `/api/products` | Create a product |

---

## Inventory Counts

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/inventory-counts` | Retrieve all inventory counts |
| GET | `/api/inventory-counts/{id}` | Retrieve a count |
| POST | `/api/inventory-counts` | Create a count |
| POST | `/api/inventory-counts/{id}/lines` | Add inventory line |
| PUT | `/api/inventory-counts/{id}/lines/{lineId}` | Edit inventory line |
| POST | `/api/inventory-counts/{id}/finalize` | Finalize inventory count |

---

# Running the Project

## Clone the repository

```bash
git clone https://github.com/CourtneyODonnell/restaurant-operations-api.git
```

---

## Configure SQL Server

Update the connection string inside:

```
RestaurantOperations.Api/appsettings.Development.json
```

---

## Apply database migrations

```bash
dotnet ef database update --project RestaurantOperations.Api
```

---

## Start the API

```bash
dotnet run --project .\RestaurantOperations.Api\RestaurantOperations.Api.csproj --launch-profile https
```

Swagger is available at:

```
https://localhost:7180/swagger
```

---

## Start the React application

```bash
cd restaurant-operations-web

npm install

npm run dev
```

Open:

```
http://localhost:5173
```

---

# Screenshots & Demonstrations

## React Dashboard

> 📷 *Screenshot coming soon*

---

## Products

> 📷 *Screenshot coming soon*

---

## Inventory Workflow

> 🎥 *GIF coming soon*

---

## Shared Backend Demonstration

> 🎥 *GIF coming soon*

Example demonstration:

```
Create Product in React

↓

Refresh Flutter

↓

Same Product Appears

↓

Both clients consuming the same ASP.NET Core API
```

---

# Testing

Backend

```bash
dotnet build

dotnet test
```

Frontend

```bash
npm run lint

npm run build
```

---

# Technical Decisions

## Shared Backend

Rather than creating separate APIs for each client, both React and Flutter communicate with a single ASP.NET Core backend. This eliminates duplicated business logic and keeps all clients consistent.

---

## API-First Business Logic

Business rules are enforced on the server rather than the client.

This ensures inventory calculations remain correct regardless of which client submits the request.

---

## DTO Pattern

The API returns Data Transfer Objects (DTOs) rather than Entity Framework entities.

Benefits include:

- Separation of persistence and presentation models
- Smaller response payloads
- Reduced risk of exposing internal implementation details
- Easier API evolution

---

## Entity Framework Core

Entity Framework Core provides strongly typed LINQ queries, change tracking, and migrations while simplifying SQL Server integration.

---

## Dependency Injection

Services and the database context are registered through ASP.NET Core's built-in dependency injection container, improving testability and separation of concerns.

---

# Lessons Learned

This project strengthened my understanding of:

- REST API design
- ASP.NET Core middleware
- Entity Framework Core
- SQL Server
- DTO design
- Dependency Injection
- React integration
- Flutter integration
- Cross-platform architecture
- Git workflows
- Full-stack application development

---

# Roadmap (Next Sprint)

Planned improvements include:

- Delete unused products with referential integrity protection
- Delete draft inventory counts while preserving finalized history
- Authentication and role-based authorization
- Search and filtering
- Pagination
- Reporting dashboard
- Supplier management
- Purchase order workflow
- Production deployment and infrastructure hardening
- CI/CD pipeline

These enhancements are intentionally planned for future iterations. The current release focuses on delivering a clean, maintainable MVP that demonstrates full-stack architecture and shared business logic.

---

# About This Project

Restaurant Operations was built as a portfolio project to demonstrate modern full-stack development practices using the Microsoft technology stack together with Flutter for cross-platform mobile development.

The primary design goal was not simply to build CRUD screens, but to build an application where multiple clients share one backend, one database, and one consistent set of business rules.