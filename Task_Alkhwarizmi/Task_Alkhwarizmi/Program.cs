using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Task_Alkhwarizmi;
using Task_Alkhwarizmi.IRepo;
using Task_Alkhwarizmi.model;
using Task_Alkhwarizmi.Repo;

namespace Task_Alkhwarizmi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Configure MongoDB settings
            builder.Services.Configure<MongoDBSettings>(
                builder.Configuration.GetSection(nameof(MongoDBSettings)));

            builder.Services.AddSingleton<IMongoDBSettings>(sp =>
                sp.GetRequiredService<IOptions<MongoDBSettings>>().Value);

            // Register MongoClient as a singleton
            builder.Services.AddSingleton<IMongoClient, MongoClient>(sp =>
            {
                var settings = sp.GetRequiredService<IOptions<MongoDBSettings>>().Value;
                if (string.IsNullOrEmpty(settings.ConnectionString))
                {
                    throw new ArgumentNullException(nameof(settings.ConnectionString), "MongoDB connection string cannot be null or empty.");
                }
                return new MongoClient(settings.ConnectionString);
            });

            // Register IMongoDatabase as a singleton
            builder.Services.AddSingleton<IMongoDatabase>(sp =>
            {
                var settings = sp.GetRequiredService<IOptions<MongoDBSettings>>().Value;
                var client = sp.GetRequiredService<IMongoClient>();
                return client.GetDatabase(settings.DatabaseName);
            });

            // Register repository
            builder.Services.AddSingleton<ITreeNodeRepo, TreeNodeRepo>();

            // Configure CORS
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.WithOrigins("http://localhost:4200")
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Alkhwarizmi API V1");
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseCors(); // Use CORS

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}
