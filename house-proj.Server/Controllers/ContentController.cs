using Asp.Versioning;
using house_proj.Server.Data.Model;
using house_proj.Server.Data.Services;
using house_proj.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace house_proj.Server.Controllers
{
        [Authorize]
        [ApiController]
        [ApiVersion("1.0")]
        [Route("api/[controller]")]
        public class ContentController : ControllerBase
        {
            private readonly IContentService _contentService;
            private readonly ILogger<ContentController> _logger;

        public ContentController(IContentService contentService,ILogger<ContentController> logger )
        {
            _contentService = contentService;
            _logger = logger;
        }

            // GET: api/content?type=Blog&onlyActive=true
            [AllowAnonymous]
            [HttpGet]
            public async Task<ActionResult<IEnumerable<ContentPostListDto>>> GetContent(
                [FromQuery] int pageNumber = 1,
                [FromQuery] int pageSize = 12,
                [FromQuery] bool? isEnabled = null)
            {
            try
            {
                var (items, totalCount) = await _contentService.GetAllContentAsync(pageNumber, pageSize, isEnabled);

                return Ok(new PagedResponse<ContentPostListDto>
                {
                    Items = items,
                    TotalCount = totalCount,
                    CurrentPage = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching paginated properties for admin");
                return StatusCode(500, "An internal error occurred.");
            }
        }

            // GET: api/content/{guid}
            [AllowAnonymous]
            [HttpGet("{guid:guid}")]
            public async Task<ActionResult<ContentPost>> GetById(Guid guid)
            {
                var post = await _contentService.GetContentByGuidAsync(guid);
                if (post == null)
                {
                    return NotFound($"Content with ID {guid} not found.");
                 }
                return Ok(post);
            }

            // POST: api/content
            [HttpPost]
            public async Task<ActionResult<ContentPost>> Create([FromBody] ContentPost post)
            {
                try
                {
                    post.Guid = Guid.Empty;
                    var createdPost = await _contentService.CreateContentAsync(post);

                    return CreatedAtAction(nameof(GetBySlug),
                        new { type = createdPost.Type, slug = createdPost.Slug },
                        createdPost);
                }
                catch (Exception ex)
                {
                    return BadRequest($"Could not create content: {ex.Message}");
                }
            }

            // PUT: api/content/{guid}
            [HttpPut("{guid:guid}")]
            public async Task<IActionResult> Update(Guid guid, [FromBody] ContentPost post)
            {
                // Robust Consistency Check
                if (guid != post.Guid)
                {
                    return BadRequest("ID mismatch between URL and body.");
                }

                try
                {
                    await _contentService.UpdateContentAsync(post);
                    return NoContent();
                }
                catch (KeyNotFoundException ex)
                {
                    return NotFound(ex.Message);
                }
            }

            // GET: api/content/blog/my-first-house-tour
            [AllowAnonymous]
            [HttpGet("{type}/{slug}")]
            public async Task<ActionResult<ContentPost>> GetBySlug(string type, string slug)
            {
                var post = await _contentService.GetContentBySlugAsync(slug, type);

                if (post == null)
                {
                    return NotFound($"Content with slug '{slug}' not found in {type}.");
                }

                return Ok(post);
            }

    }
}

