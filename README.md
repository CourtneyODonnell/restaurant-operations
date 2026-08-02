\# Restaurant Operations API



A .NET 8 training API that demonstrates a restaurant inventory-count workflow.



\## Features

\- Create and list products

\- Create draft inventory counts

\- Add and update inventory-count lines

\- Calculate expected-versus-actual variance

\- Require reasons for non-zero variances

\- Finalize valid counts

\- Prevent edits after finalization

\- Persist data with EF Core and SQL Server

\- Validate business rules with xUnit tests



\## Technology

\- .NET 8 and C#

\- ASP.NET Core Web API

\- Entity Framework Core 8

\- SQL Server

\- xUnit



\## Local setup

1\. Install the .NET 8 SDK, Visual Studio 2022 with ASP.NET workload, and SQL Server.

2\. Update the connection string in `RestaurantOperations.Api/appsettings.json`.

3\. Run `dotnet ef database update --project RestaurantOperations.Api --startup-project RestaurantOperations.Api`.

4\. Run `dotnet run --project RestaurantOperations.Api`.

5\. Open the Swagger URL printed in the terminal.



\## Tests

Run `dotnet test` from the solution folder.



\## Important business rule

Every inventory-count line with a non-zero variance requires a reason between 10 and 500 characters before the count can be finalized. Finalized counts cannot be edited.



\## Training-data notice

This repository uses fictional data and contains no employer code, credentials, production data, proprietary schemas, or confidential documents.



