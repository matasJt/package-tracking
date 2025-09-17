using Application.Interfaces;
using Application.Services;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Web;

public static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddScoped<PackageService>();
        builder.Services.AddScoped<IPackageRepository, PackageRepository>();
        builder.Services.AddScoped<SeedData>();
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddOpenApi();
        builder.Services.AddDbContext<PackageDbContext>(options => options.UseInMemoryDatabase(builder.Configuration.GetConnectionString("Database")));
        builder.Services.AddCors(policy => policy.AddDefaultPolicy(options =>
            options.WithOrigins("http://localhost:5001").AllowAnyHeader().AllowAnyMethod().AllowCredentials()));
        var app = builder.Build();
        
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        using (var scope = app.Services.CreateScope())
        {
            var seeder = scope.ServiceProvider.GetRequiredService<SeedData>();
            _ = seeder.SeedAsync();
        }
        app.UseCors();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}