using Microsoft.Extensions.Caching.Memory;
using System.Net;

namespace house_proj.Server.Middleware
{
    public class BotShieldMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IMemoryCache _cache; // Inject memory cache for server-side tracking

        // Pass IMemoryCache into the constructor
        public BotShieldMiddleware(RequestDelegate next, IMemoryCache cache)
        {
            _next = next;
            _cache = cache;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value?.ToLower() ?? "";

            // 1. Early Exits (Bypass security for these)
            if (HttpMethods.IsOptions(context.Request.Method) || path.EndsWith("sitemap.xml"))
            {
                await _next(context);
                return;
            }

            // 2. Identify the user
            var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown-ip";
            var banKey = $"banned_{ipAddress}";

            // 3. Check Ban Status (Do this ONCE, early)
            if (_cache.TryGetValue(banKey, out _))
            {
                await WriteErrorResponse(context, 403, "Access restricted.");
                return;
            }

            // 4. API Specific Protection
            bool isApi = path.StartsWith("/api/");
            if (isApi)
            {
                bool isInitPath = path.Contains("/session/init");
                if (!isInitPath && !IsAdmin(context))
                {
                    // Rate Limiting
                    if (!await HandleGeneralApiThrottling(context, ipAddress)) return;

                    // Email Specific Limiting
                    if (path.Contains("/email/send"))
                    {
                        if (!await HandleEmailRateLimiting(context, ipAddress)) return;
                    }
                }
            }

            // 5. Execute the pipeline
            await _next(context);

            // 6. Track errors AFTER execution
            // Only track client-side errors (400-499). 500s are server issues.
            if (context.Response.StatusCode >= 400 && context.Response.StatusCode < 500)
            {
                HandleErrorTrackingLogic(ipAddress, banKey);
            }
        }

        // --- HELPER METHODS ---

        private void HandleErrorTrackingLogic(string ipAddress, string banKey)
        {
            var errorKey = $"errors_{ipAddress}";

            // Explicitly type this as <int>
            var errorCount = _cache.GetOrCreate<int>(errorKey, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);
                return 0;
            });

            errorCount++;
            _cache.Set(errorKey, errorCount, TimeSpan.FromMinutes(10));

            if (errorCount >= 10)
            {
                _cache.Set(banKey, true, TimeSpan.FromHours(1));
            }
        }

        private async Task<bool> HandleGeneralApiThrottling(HttpContext context, string ipAddress)
        {
            var throttleKey = $"req_{ipAddress}";

            
            var requestData = _cache.GetOrCreate<RateLimitData>(throttleKey, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(10);
                return new RateLimitData { StartTime = DateTime.UtcNow, Count = 0 };
            });

            // If for some reason the cache returned null (unlikely with GetOrCreate), handle it
            if (requestData == null) requestData = new RateLimitData { StartTime = DateTime.UtcNow, Count = 0 };

            int newCount = requestData.Count + 1;

            var timeElapsed = DateTime.UtcNow - requestData.StartTime;

            // Logic checks
            if (timeElapsed.TotalSeconds < 2 && newCount > 15)
            {
                return await WriteErrorResponse(context, 429, "Slow down! Too fast.");
            }

            if (newCount >= 100)
            {
                return await WriteErrorResponse(context, 429, "Rate limit exceeded.");
            }

            
            _cache.Set(throttleKey, new RateLimitData
            {
                StartTime = requestData.StartTime,
                Count = newCount
            }, TimeSpan.FromSeconds(30));

            return true;
        }

        private async Task<bool> HandleEmailRateLimiting(HttpContext context, string ipAddress)
        {
            var emailKey = $"email_{ipAddress}";
            var emailCount = _cache.GetOrCreate(emailKey, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1); // 1-hour window
                return 0;
            });

            if (emailCount >= 3)
            {
                return await WriteErrorResponse(context, 429, "You have reached the limit of 3 emails per hour.");
            }

            _cache.Set(emailKey, emailCount + 1);
            return true;
        }

        private async Task<bool> WriteErrorResponse(HttpContext context, int statusCode, string message)
        {
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync($"{{\"message\": \"{message}\"}}");
            return false; // Tells caller to stop processing
        }

        private bool IsAdmin(HttpContext context)
        {
            return context.User.Identity?.IsAuthenticated == true &&
                   context.User.IsInRole("Admin");
        }

        public class RateLimitData
        {
            public DateTime StartTime { get; set; }
            public int Count { get; set; }
        }
    }
}