using Google.Cloud.Firestore;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace house_proj.Server.Data.Model
{
    [FirestoreData]
    public class AvailableProperty
    {

        [JsonPropertyName("id")]
        public required Guid Guid { get; set; }

        [FirestoreProperty("Guid")]
        public string GuidString
        {
            get => Guid.ToString();
            set => Guid = Guid.TryParse(value, out var g) ? g : Guid;
        }

        [Required]
        [JsonPropertyName("name")]
        [FirestoreProperty]
        public required string Name { get; set; }

        [Required]
        [JsonPropertyName("price")]
        [FirestoreProperty]
        public required double Price { get; set; }

        [Required]
        [JsonPropertyName("mediaItems")]
        [FirestoreProperty]
        public required MediaItem[] MediaItems { get; set; } = new MediaItem[5];

        [Required]
        [JsonPropertyName("floorSpace")]
        [FirestoreProperty]
        public required int FloorSpace { get; set; }

        [Required]
        [JsonPropertyName("description")]
        [FirestoreProperty]
        public required string Description { get; set; }

        [Required]
        [JsonPropertyName("builtYear")]
        [FirestoreProperty]
        public required short BuiltYear { get; set; }

        [Required]
        [JsonPropertyName("address")]
        [FirestoreProperty]
        public required string Address { get; set; }

        [Required]
        [JsonPropertyName("bedrooms")]
        [FirestoreProperty]
        public required short Bedrooms { get; set; }

        [Required]
        [JsonPropertyName("bathrooms")]
        [FirestoreProperty]
        public required short Bathrooms { get; set; }

        [Required]
        [JsonPropertyName("levels")]
        [FirestoreProperty]
        public required short Levels { get; set; }

        [Required]
        [JsonPropertyName("latitude")]
        [FirestoreProperty]
        public required double Latitude { get; set; }

        [Required]
        [JsonPropertyName("longitude")]
        [FirestoreProperty]
        public required double Longitude { get; set; }

        [Required]
        [JsonPropertyName("propertyType")]
        [FirestoreProperty]
        public required PropertyType PropertyType { get; set; }

        [Required]
        [JsonPropertyName("subPropertyType")]
        [FirestoreProperty]
        public required SubPropertyType SubPropertyType { get; set; }

        [JsonPropertyName("dateCreated")]
        public DateOnly DateCreated { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);

        [FirestoreProperty("DateCreated")]
        public string DateCreatedString
        {
            get => DateCreated.ToString("yyyy-MM-dd");
            set => DateCreated = DateOnly.TryParse(value, out var d) ? d : DateOnly.FromDateTime(DateTime.UtcNow);
        }

        [Required]
        [JsonPropertyName("isEnabled")]
        [FirestoreProperty]
        public required bool IsEnabled { get; set; }


        [FirestoreProperty]
        public List<string> NameKeywords { get; set; } = new();

        [FirestoreProperty]
        public List<string> AddressKeywords { get; set; } = new();

        //The Foreign Key
        [JsonPropertyName("employeeProfileID")]
        public Guid EmployeeProfileID { get; set; }

        [FirestoreProperty("EmployeeProfileID")]
        public string EmployeeProfileIDString
        {
            get => EmployeeProfileID.ToString();
            set => EmployeeProfileID = Guid.TryParse(value, out var g) ? g : EmployeeProfileID;
        }
    }

}

    // --- SUPPORTING ENUMS ---

    public enum PropertyType
    {
        Buy = 0,
        Rent = 1,
        ForeClosed = 2, 
    }

    public enum SubPropertyType
    {
        LotOnly = 0,      // "Lot(only)"
        HouseAndLot = 1,  // "House & Lot"
        Condominium = 2,  // "Condominium"
        Commercial = 3,    // "Commercial"
       
    }
    [FirestoreData]
    public class MediaItem
    {
        [JsonProperty("Url")]
        [JsonPropertyName("url")]
        [FirestoreProperty]
        public string? Url { get; set; }

        [JsonProperty("VideoDetails")]
        [JsonPropertyName("videoDetails")]
        [FirestoreProperty]
        public VideoLink? VideoDetails { get; set; }
    }

    [FirestoreData]
    public class VideoLink
    {
        [JsonProperty("videoUrl")]
        [JsonPropertyName("videoUrl")]
        [FirestoreProperty]
        public string VideoUrl { get; set; } = string.Empty;
    }

public class PropertyCardDto
{
    [JsonPropertyName("id")]

    public Guid Guid { get; set; }

    [JsonPropertyName("name")]

    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("price")]

    public decimal Price { get; set; }

    [JsonPropertyName("address")]

    public string Address { get; set; } = string.Empty;

    [JsonPropertyName("bedrooms")]

    public short Bedrooms { get; set; }

    [JsonPropertyName("bathrooms")]

    public short Bathrooms { get; set; }

    [JsonPropertyName("floorSpace")]

    public int FloorSpace { get; set; }

    [JsonPropertyName("levels")]

    public short Levels { get; set; }

    [JsonPropertyName("thumbnailUrl")]

    public string? ThumbnailUrl { get; set; }

    [JsonPropertyName("propertyType")]

    public PropertyType PropertyType { get; set; }

    [JsonPropertyName("subPropertyType")]

    public SubPropertyType SubPropertyType { get; set; }

    [JsonPropertyName("dateCreated")]
    public DateOnly DateCreated { get; set; }
}

public class PropertyAdminListDto
{
    [JsonPropertyName("guid")]
    public Guid Guid { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("address")]
    public string Address { get; set; } = string.Empty;

    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [JsonPropertyName("thumbnailUrl")]
    public string? ThumbnailUrl { get; set; }

    [JsonPropertyName("isEnabled")]
    public bool IsEnabled { get; set; } 

    [JsonPropertyName("dateCreated")]
    public DateOnly DateCreated { get; set; }

    [JsonPropertyName("propertyType")]
    public PropertyType PropertyType { get; set; }

    [JsonPropertyName("subPropertyType")]
    public SubPropertyType SubPropertyType { get; set; }

    [JsonPropertyName("employeeProfileID")]
    public Guid EmployeeProfileID { get; set; }
}