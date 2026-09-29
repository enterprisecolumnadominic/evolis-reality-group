using Google.Cloud.Firestore;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace house_proj.Server.Data.Model
{
    [FirestoreData] 
    public class ContentPost
    {
        [JsonProperty("id")]
        [JsonPropertyName("id")]
        public required Guid Guid { get; set; }

        [FirestoreProperty("Guid")]
        public string GuidString
        {
            get => Guid.ToString();
            set => Guid = Guid.TryParse(value, out var g) ? g : Guid.Empty;
        }

        [JsonProperty("type")]
        [JsonPropertyName("type")]
        [FirestoreProperty]
        public string Type { get; set; } = "Blog";

        [JsonProperty("title")]
        [JsonPropertyName("title")]
        [FirestoreProperty]
        public string Title { get; set; } = string.Empty;

        [JsonProperty("slug")]
        [JsonPropertyName("slug")]
        [FirestoreProperty]
        public string Slug { get; set; } = string.Empty;

        [JsonProperty("author")]
        [JsonPropertyName("author")]
        [FirestoreProperty]
        public string Author { get; set; } = string.Empty;

        [JsonProperty("content")]
        [JsonPropertyName("content")]
        [FirestoreProperty]
        public string Content { get; set; } = string.Empty;

        [JsonProperty("imageUrl")]
        [JsonPropertyName("imageUrl")]
        [FirestoreProperty]
        public string? ImageUrl { get; set; }

        private DateTime _publishedDate;
        [JsonProperty("publishedDate")]
        [JsonPropertyName("publishedDate")]
        [FirestoreProperty]
        public DateTime PublishedDate
        {
            get => _publishedDate;
            set => _publishedDate = DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }

        private DateTime? _eventDate;
        [JsonProperty("eventDate")]
        [JsonPropertyName("eventDate")]
        [FirestoreProperty]
        public DateTime? EventDate
        {
            get => _eventDate;
            set => _eventDate = value.HasValue
                ? DateTime.SpecifyKind(value.Value, DateTimeKind.Utc)
                : null;
        }

        [JsonProperty("isFeatured")]
        [JsonPropertyName("isFeatured")]
        [FirestoreProperty]
        public bool IsFeatured { get; set; } = false;

        [JsonProperty("tagLine")]
        [JsonPropertyName("tagLine")]
        [FirestoreProperty]
        public required string TagLine { get; set; }

        [JsonProperty("tags")]
        [JsonPropertyName("tags")]
        [FirestoreProperty]
        public List<string> Tags { get; set; } = new();

        [Required]
        [JsonProperty("IsActive")]
        [JsonPropertyName("isActive")]
        [FirestoreProperty]
        public required bool IsActive { get; set; }
    }
    public class ContentPostListDto
    {
        [JsonPropertyName("guid")]
        public Guid Guid { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; } = "Blog";

        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("slug")]
        public string Slug { get; set; } = string.Empty;

        [JsonPropertyName("author")]
        public string Author { get; set; } = "Admin";

        [JsonPropertyName("imageUrl")]
        public string? ImageUrl { get; set; }

        [JsonPropertyName("tagLine")]
        public string TagLine { get; set; } = string.Empty;

        [JsonPropertyName("publishedDate")]
        public DateTime PublishedDate { get; set; }

        [JsonPropertyName("isFeatured")]
        public bool IsFeatured { get; set; }

        [JsonPropertyName("isActive")]
        public bool IsActive { get; set; }

        [JsonPropertyName("tags")]
        public List<string> Tags { get; set; } = new();
    }
}

