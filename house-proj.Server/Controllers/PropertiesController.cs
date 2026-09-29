using Asp.Versioning;
using house_proj.Server.Data.Model;
using house_proj.Server.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace house_proj.Server.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;
        private readonly ILogger<PropertiesController> _logger;

        public PropertiesController(IPropertyService propertyService, ILogger<PropertiesController> logger)
        {
            _propertyService = propertyService;
            _logger = logger;
        }

        // 1. GET ALL: api/properties?pageNumber=1&pageSize=12
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 12,
            [FromQuery] bool? isEnabled = null)
        {
            try
            {
               
                var (items, totalCount) = await _propertyService.GetAllPropertiesAsync(pageNumber, pageSize, isEnabled);

                return Ok(new PagedResponse<PropertyAdminListDto>
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

        // 2. GET BY ID: api/properties/{id}
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<AvailableProperty>> GetById(Guid id)
        {
            try
            {
                if (id == Guid.Empty)
                {
                    return BadRequest(new { error = "Invalid property ID" });
                }

                var property = await _propertyService.GetPropertyByIdAsync(id);

                if (property == null)
                {
                    return NotFound(new { message = $"Property {id} not found." });
                }

                return Ok(property);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching property with ID {PropertyId}", id);
                return StatusCode(500, "Error retrieving property details.");
            }
        }

        // 3. POST: api/properties
        [HttpPost]
        public async Task<ActionResult<AvailableProperty>> Create([FromBody] AvailableProperty newProperty)
        {
            try
            {
                _logger.LogInformation($"{newProperty.EmployeeProfileID} is logged");
                if (newProperty.EmployeeProfileID == Guid.Empty)
                {
                    // If this logs, the JSON from React is NOT reaching the C# property.
                    _logger.LogWarning("DATA LOSS: EmployeeProfileID is Empty!");
                }

                if (newProperty == null) return BadRequest();

                if (newProperty.Guid == Guid.Empty) newProperty.Guid = Guid.NewGuid();

                var createdProperty = await _propertyService.AddNewPropertyAsync(newProperty);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = createdProperty.Guid },
                    createdProperty
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create new property: {PropertyName}", newProperty.Name);
                return BadRequest(new { message = "Could not create property. Please check your data." });
            }
        }

        // PUT: api/properties/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] AvailableProperty propertyToUpdate)
        {
            try
            {
               
                //Validation: Ensure the URL ID matches the Body ID
                if (id != propertyToUpdate.Guid)
                {
                    return BadRequest(new { message = "ID mismatch between URL and request body." });
                }

                await _propertyService.UpdatePropertyAsync(propertyToUpdate);
                return NoContent(); // 204 Success
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Update failed: Property {PropertyId} not found.", id);
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Critical error updating property {PropertyId}", id);
                return StatusCode(500, new { message = "An error occurred during update." });
            }
        }

        // 5. GET: api/properties/paged?pageSize=12&nameTerm=Towers&continuationToken=...
        [AllowAnonymous]
        [HttpGet("paged")]
        public async Task<ActionResult> GetPaged([FromQuery] PropertySearchRequest request)
        {
            try
            {
                string? tokenToUse = request.ContinuationToken;

                var (items, nextToken, totalCount) = await _propertyService.GetPropertiesPagedAsync(
                    request.PageSize,
                    request.IsEnabled,
                    request.NameTerm,
                    request.AddressTerm,
                    request.Type,
                    request.SubType,
                    tokenToUse
                );

                return Ok(new PagedResponse<PropertyCardDto>
                {
                    Items = items,
                    NextToken = nextToken,
                    TotalCount = totalCount,
                    PageSize = request.PageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / request.PageSize),
                    CurrentPage = 1
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching properties via POST body.");
                return StatusCode(500, new { message = "An error occurred while fetching properties." });
            }
        }
    }
}