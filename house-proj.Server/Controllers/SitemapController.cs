using house_proj.Server.Data.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace house_proj.Server.Controllers
{
    //[ApiController]
    //public class SitemapController : ControllerBase
    //{
    //    private readonly IPropertyService _propertyService;
    //    private readonly IContentService _contentService;
    //    private readonly string _baseUrl;

    //    public SitemapController(
    //        IPropertyService propertyService,
    //        IContentService contentService,
    //        IConfiguration configuration)
    //    {
    //        _propertyService = propertyService;
    //        _contentService = contentService;

    //        _baseUrl = configuration["FrontendSettings:BaseUrl"] ?? "https://may-housing-ph.web.app/";
    //    }

    //    [HttpGet("sitemap.xml")]
    //    public async Task<IActionResult> GetSitemap()
    //    {
    //        var propertyItems = await _propertyService.GetAllPropertiesAsync(1, 999, isEnabled: true);
    //        var blogItems = await _contentService.GetAllContentAsync(1, 999);

    //        var sb = new StringBuilder();
    //        sb.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
    //        sb.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

    //        // Use the _baseUrl variable instead of typing the link again!
    //        sb.AppendLine($"  <url><loc>{_baseUrl}/</loc><priority>1.0</priority></url>");
    //        sb.AppendLine($"  <url><loc>{_baseUrl}/properties</loc><priority>0.8</priority></url>");

    //        foreach (var p in propertyItems.Items)
    //        {
    //            sb.AppendLine("  <url>");
    //            sb.AppendLine($"    <loc>{_baseUrl}/properties/{p.Guid}</loc>");
    //            sb.AppendLine("    <priority>0.7</priority>");
    //            sb.AppendLine("  </url>");
    //        }

    //        foreach (var post in blogItems.Items)
    //        {
    //            sb.AppendLine("  <url>");
    //            sb.AppendLine($"    <loc>{_baseUrl}/blog/{post.Slug}</loc>");
    //            sb.AppendLine("    <priority>0.6</priority>");
    //            sb.AppendLine("  </url>");
    //        }

    //        sb.AppendLine("</urlset>");
    //        return Content(sb.ToString(), "application/xml", Encoding.UTF8);
    //    }
    //}
}
