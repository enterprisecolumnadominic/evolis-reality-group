using Microsoft.Extensions.Caching.Memory;

namespace house_proj.Server.Middleware
{
    public class IpRateLimitingMiddleware
    {
        private readonly IMemoryCache _memoryCache;
        private readonly ILogger<IpRateLimitingMiddleware> _logger;
        private readonly RequestDelegate _next;

        // Configurable rate limits per endpoint
        private static readonly Dictionary<string, (int Limit, int WindowSeconds)> EndpointLimits = new()
    {
        // Strict limits on authentication endpoints (brute force protection)
        { "/auth/login", (5, 60) },           // 5 attempts per 60 seconds
        { "/auth/register", (3, 3600) },      // 3 registrations per hour
        { "/auth/forgot-password", (3, 3600) },

        // Email endpoints (spam prevention)
        { "/email/send", (10, 3600) },        // 10 emails per hour
        { "/contact/submit", (5, 3600) },     // 5 contact forms per hour

        // General API endpoints
        { "/api/*", (100, 60) }               // 100 requests per minute (catch-all)
    };

        public IpRateLimitingMiddleware(RequestDelegate next, IMemoryCache memoryCache, ILogger<IpRateLimitingMiddleware> logger)
        {
            _next = next;
            _memoryCache = memoryCache;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Get client IP address (respects X-Forwarded-For header from reverse proxies)
            var clientIp = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var path = context.Request.Path.Value?.ToLower() ?? "/";
            var method = context.Request.Method;

            // Skip rate limiting for OPTIONS requests (CORS preflight)
            if (method == "OPTIONS")
            {
                await _next(context);
                return;
            }

            // Find matching endpoint limit
            var (limit, windowSeconds) = GetRateLimit(path);
            var cacheKey = $"ratelimit:{clientIp}:{path}";
            var now = DateTimeOffset.UtcNow;

            // Get or create request record
            if (!_memoryCache.TryGetValue(cacheKey, out RequestRecord? record))
            {
                record = new RequestRecord();
            }

            // Clean old requests outside the time window
            record!.Requests.RemoveAll(r => (now - r).TotalSeconds > windowSeconds);

            // Check if limit exceeded
            if (record.Requests.Count >= limit)
            {
                _logger.LogWarning($"Rate limit exceeded for {clientIp} on {path}. Limit: {limit}/{windowSeconds}s");

                context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                context.Response.Headers.Add("Retry-After", windowSeconds.ToString());
                await context.Response.WriteAsJsonAsync(new
                {
                    error = "Too many requests. Please try again later.",
                    retryAfter = windowSeconds
                });
                return;
            }

            // Record this request
            record.Requests.Add(now);
            _memoryCache.Set(cacheKey, record, TimeSpan.FromSeconds(windowSeconds + 10));

            // Continue to next middleware
            await _next(context);
        }

        private (int Limit, int WindowSeconds) GetRateLimit(string path)
        {
            // Check for exact match first
            if (EndpointLimits.TryGetValue(path, out var limit))
                return limit;

            // Check for wildcard match
            foreach (var (pattern, config) in EndpointLimits)
            {
                if (pattern.EndsWith("*"))
                {
                    var prefix = pattern.TrimEnd('*');
                    if (path.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
                        return config;
                }
            }

            // Default: 100 requests per minute
            return (100, 60);
        }

        private class RequestRecord
        {
            public List<DateTimeOffset> Requests { get; set; } = new();
        }
    }
}
