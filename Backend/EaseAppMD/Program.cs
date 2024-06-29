using EaseAppMD;
using EaseAppMD.Interfaces;
using EaseAppMD.Repositories;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options => options.AddPolicy("MyAllowedOriginsPolicy",
    builder =>
    {
        builder
        .WithOrigins("http://localhost:3000", "http://localhost:5000") 
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    }));


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<MyDbContext>(opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("MyDbContext")));
builder.Services.AddHangfire(config =>
        config.UseSqlServerStorage(builder.Configuration.GetConnectionString("MyDbContext")));
builder.Services.AddHangfireServer();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IDoctorsRepository, DoctorsRepository>();
builder.Services.AddScoped<IEmailRepository, EmailRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<ReminderRepository>(provider =>
{
    var appointmentRepo = provider.GetRequiredService<IAppointmentRepository>();
    // If ReaminderRepository requires more dependencies, resolve them similarly
    return new ReminderRepository(appointmentRepo);
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("MyAllowedOriginsPolicy");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.UseHangfireDashboard();
// Schedule the job
RecurringJob.AddOrUpdate<ReminderRepository>(
    "send-reminders",
    service => service.SendReminders(),
    Cron.Daily,
    timeZone: TimeZoneInfo.Local);

app.Run();
