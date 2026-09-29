using house_proj.Server.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Text;
using static house_proj.Server.Middleware.BotShieldMiddleware;

namespace UnitTest.Middleware
{
    public class BotShieldMiddlewareTest
    {
        private readonly IMemoryCache _cache;

        public BotShieldMiddlewareTest()
        {
            // Initialize a fresh cache for every test run
            var services = new ServiceCollection();
            services.AddMemoryCache();
            var serviceProvider = services.BuildServiceProvider();
            _cache = serviceProvider.GetRequiredService<IMemoryCache>();
        }

        private BotShieldMiddleware CreateMiddleware(RequestDelegate next)
        {
            return new BotShieldMiddleware(next, _cache);
        }

        [Fact]
        public async Task InvokeAsync_BannedIP_Returns403()
        {
            // Arrange
            var context = new DefaultHttpContext();
            var ip = "1.2.3.4";
            context.Connection.RemoteIpAddress = IPAddress.Parse(ip);
            context.Request.Path = "/api/properties";

            // Manually add the ban to our server-side cache
            _cache.Set($"banned_{ip}", true);

            bool nextCalled = false;
            RequestDelegate next = (ctx) => { nextCalled = true; return Task.CompletedTask; };
            var middleware = CreateMiddleware(next);

            // Act
            await middleware.InvokeAsync(context);

            // Assert
            Assert.Equal(403, context.Response.StatusCode);
            Assert.False(nextCalled);
        }

        [Fact]
        public async Task InvokeAsync_TooManyRequests_Returns429()
        {
            // Arrange
            var context = new DefaultHttpContext();
            var ip = "9.9.9.9";
            context.Connection.RemoteIpAddress = IPAddress.Parse(ip);
            context.Request.Path = "/api/properties";

            // FIX: Use the named RateLimitData class instead of new { ... }
            _cache.Set($"req_{ip}", new RateLimitData
            {
                StartTime = DateTime.UtcNow,
                Count = 50
            });

            bool nextCalled = false;
            RequestDelegate next = (ctx) => { nextCalled = true; return Task.CompletedTask; };
            var middleware = CreateMiddleware(next);

            // Act
            await middleware.InvokeAsync(context);

            // Assert
            Assert.Equal(429, context.Response.StatusCode);
            Assert.False(nextCalled);
        }

        [Fact]
        public async Task InvokeAsync_EmailLimitExceeded_Returns429()
        {
            // Arrange
            var context = new DefaultHttpContext();
            var ip = "5.5.5.5";
            context.Connection.RemoteIpAddress = IPAddress.Parse(ip);
            context.Request.Path = "/api/email/send";

            // Simulate 3 emails already sent
            _cache.Set($"email_{ip}", 3);

            bool nextCalled = false;
            RequestDelegate next = (ctx) => { nextCalled = true; return Task.CompletedTask; };
            var middleware = CreateMiddleware(next);

            // Act
            await middleware.InvokeAsync(context);

            // Assert
            Assert.Equal(429, context.Response.StatusCode);
            Assert.False(nextCalled);
        }

        [Fact]
        public async Task InvokeAsync_ValidRequest_CallsNext()
        {
            // Arrange
            var context = new DefaultHttpContext();
            context.Connection.RemoteIpAddress = IPAddress.Parse("127.0.0.1");
            context.Request.Path = "/api/properties";

            bool nextCalled = false;
            RequestDelegate next = (ctx) => { nextCalled = true; return Task.CompletedTask; };
            var middleware = CreateMiddleware(next);

            // Act
            await middleware.InvokeAsync(context);

            // Assert
            Assert.True(nextCalled);
            Assert.Equal(200, context.Response.StatusCode);

            // Verify cache was actually updated
            Assert.True(_cache.TryGetValue("req_127.0.0.1", out _));
        }

        [Fact]
        public async Task InvokeAsync_After10Errors_IPIsAutomaticallyBanned()
        {
            var ip = "1.1.1.1";
            var nextCount = 0;
            RequestDelegate errorNext = (ctx) => { nextCount++; ctx.Response.StatusCode = 404; return Task.CompletedTask; };
            var middleware = CreateMiddleware(errorNext);

            // 1. Trigger 10 errors
            for (int i = 0; i < 10; i++)
            {
                var context = new DefaultHttpContext();
                context.Connection.RemoteIpAddress = IPAddress.Parse(ip);
                await middleware.InvokeAsync(context);
            }

            // 2. Verify the 10th request set the cache
            Assert.True(_cache.TryGetValue($"banned_{ip}", out _), "Ban key should exist in cache");

            // 3. The 11th request
            var finalContext = new DefaultHttpContext();
            finalContext.Connection.RemoteIpAddress = IPAddress.Parse(ip);
            await middleware.InvokeAsync(finalContext);

            // 4. Final Checks
            Assert.Equal(403, finalContext.Response.StatusCode);
            Assert.Equal(10, nextCount); // Should not have incremented to 11
        }
    }
}