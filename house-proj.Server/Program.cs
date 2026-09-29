using Asp.Versioning;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using house_proj.Server.Data;
using house_proj.Server.Data.Database.Firebase;
using house_proj.Server.Data.Repositories;
using house_proj.Server.Data.Repository;
using house_proj.Server.Data.Services;
using house_proj.Server.Middleware;
using house_proj.Server.Middleware.CAPTCHA;
using house_proj.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

// --- CONFIGURATION BINDINGS ---
builder.Services.AddOptions<MailSettings>()
    .Bind(builder.Configuration.GetSection("MailSettings"))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.Configure<RecaptchaSettings>(builder.Configuration.GetSection("reCAPTCHAv2"));

// --- FIRESTORE SETUP ---
builder.Services.AddSingleton(sp =>
{
    string projectId = builder.Configuration["FirestoreSettings:ProjectId"]
        ?? throw new InvalidOperationException("Firestore ProjectId is missing in appsettings.json.");

    string firestoreKeyPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "firebase-key.json");

    if (!File.Exists(firestoreKeyPath))
    {
        throw new FileNotFoundException($"Firestore key not found at: {firestoreKeyPath}. " +
            "Ensure 'Copy to Output Directory' is set to 'Copy always' or 'Copy if newer'.");
    }

    return new FirestoreDbBuilder
    {
        ProjectId = projectId,
        Credential = GoogleCredential.FromFile(firestoreKeyPath)
    }.Build();
});

// --- REPOSITORY & SERVICE REGISTRATIONS ---
builder.Services.AddScoped<IPropertyRepository, FirestorePropertyRepository>();
builder.Services.AddScoped<IEmployeeRepository, FirestoreEmployeeRepository>();
builder.Services.AddScoped<IContentRepository, FirestoreContentRepository>();

builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IContentService, ContentService>();
builder.Services.AddTransient<IEmailService, GmailEmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddHttpClient<ICaptchaService, GoogleCaptchaService>();

// --- AUTHENTICATION & JWT CONFIGURATION ---
var jwtSection = builder.Configuration.GetSection("JwtSettings");
var jwtSecret = jwtSection["SecretKey"]
    ?? throw new InvalidOperationException("JWT Secret Key is missing in appsettings.json!");

// Verify key length for HMAC-SHA256 security compliance
if (Encoding.UTF8.GetByteCount(jwtSecret) < 32)
{
    throw new InvalidOperationException("JWT Secret Key must be at least 256 bits (32 characters) long.");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtSection["Issuer"] ?? "house-proj-api",

        ValidateAudience = true,
        ValidAudience = jwtSection["Audience"] ?? "house-proj-admin",

        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),

        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(1),

        NameClaimType = ClaimTypes.NameIdentifier,
        RoleClaimType = ClaimTypes.Role
    };

    options.SaveToken = false;
    options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
    options.TokenValidationParameters.ValidateTokenReplay = true;
});

// --- CORS POLICY  ---
var allowedOrigins = builder.Configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .WithMethods("GET", "POST","PUT")
              .WithHeaders("Content-Type", "Authorization", "X-Requested-With")
              .AllowCredentials()
              .WithExposedHeaders("X-Total-Count", "X-Page-Number")
              .SetPreflightMaxAge(TimeSpan.FromHours(1));
    });
});


builder.Services.AddMemoryCache();

// --- CONTROLLERS & API VERSIONING ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = ApiVersionReader.Combine(
        new QueryStringApiVersionReader("api-version"),
        new HeaderApiVersionReader("X-Version")
    );
})
.AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// --- MIDDLEWARE PIPELINE ---

// 1. Forwarded Headers for reverse proxies
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

// 2. HTTPS Enforcement & HSTS (Production)
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();

// custom security headers middleware
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");

    context.Response.Headers.Add("X-Frame-Options", "DENY");

    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");

    context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");

    if (!app.Environment.IsDevelopment())
    {
        context.Response.Headers.Add("Content-Security-Policy",
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;");
    }

    context.Response.Headers.Remove("Server");

    await next();
});

// 4. Swagger / Developer Tooling
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "House Project API v1");
    });
}

// 5. Static Files & Routing
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();

// Rate limiting middleware (before CORS)
app.UseMiddleware<IpRateLimitingMiddleware>();

// 7. Security & Auth Middleware
app.UseCors("AllowFrontend");
app.UseMiddleware<BotShieldMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

// 8. Endpoint Mapping
app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();

