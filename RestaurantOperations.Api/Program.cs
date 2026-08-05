using Microsoft.EntityFrameworkCore;
using RestaurantOperations.Api.Data;
using RestaurantOperations.Api.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database connection
var connectionString = builder.Configuration
    .GetConnectionString("RestaurantOperations")
    ?? throw new InvalidOperationException(
        "Database connection string is missing.");

builder.Services.AddDbContext<RestaurantOperationsDbContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddScoped<InventoryCountService>();

//Enable local dev CORS in the API 
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(
        "http://localhost:5173",
        "http://localhost:5174")
    .AllowAnyHeader()
    .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseCors("Frontend");

// Keep local Flutter Web development on HTTP.
// Production should still redirect to HTTPS.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();