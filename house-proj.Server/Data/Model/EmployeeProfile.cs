using Google.Cloud.Firestore;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace house_proj.Server.Data.Model
{
    [FirestoreData]
    public class EmployeeProfile
    {
        [JsonProperty("id")]
        [JsonPropertyName("id")]
        public Guid? Guid { get; set; }

        [FirestoreProperty("Guid")]
        public string GuidString
        {
            get => Guid?.ToString() ?? string.Empty;
            set => Guid = System.Guid.TryParse(value, out var g) ? g : System.Guid.Empty;
        }

        [Required]
        [JsonProperty("name")]
        [JsonPropertyName("name")]
        [FirestoreProperty]
        public required string Name { get; set; }

        [Required]
        [JsonProperty("title")]
        [JsonPropertyName("title")]
        [FirestoreProperty]
        public required string Title { get; set; }

        [Required]
        [EmailAddress]
        [JsonProperty("email")]
        [JsonPropertyName("email")]
        [FirestoreProperty]
        public required string Email { get; set; }

        [Required]
        [Phone]
        [JsonProperty("phone")]
        [JsonPropertyName("phone")]
        [FirestoreProperty]
        public required string Phone { get; set; }

        [Required]
        [JsonProperty("profilePhoto")]
        [JsonPropertyName("profilePhoto")]
        [FirestoreProperty]
        public required string ProfilePhoto { get; set; }

        [JsonProperty("bodyPhoto")]
        [JsonPropertyName("bodyPhoto")]
        [FirestoreProperty]
        public string? BodyPhoto { get; set; }

        [Required]
        [JsonProperty("description")]
        [JsonPropertyName("description")]
        [FirestoreProperty]
        public required string Description { get; set; }

        [Required]
        [JsonProperty("specialties")]
        [JsonPropertyName("specialties")]
        [FirestoreProperty]
        public required string[] Specialties { get; set; } = Array.Empty<string>();

        [Required]
        [JsonProperty("languages")]
        [JsonPropertyName("languages")]
        [FirestoreProperty]
        public required string[] Languages { get; set; } = Array.Empty<string>();

        [Required]
        [JsonProperty("socials")]
        [JsonPropertyName("socials")]
        [FirestoreProperty]
        public required SocialLinks Socials { get; set; }

        [Required]
        [JsonProperty("isActive")]
        [JsonPropertyName("isActive")]
        [FirestoreProperty]
        public required bool IsActive { get; set; }
    }

    [FirestoreData]
    public class SocialLinks
    {
        [JsonProperty("linkedin")]
        [JsonPropertyName("linkedin")]
        [FirestoreProperty]
        public string? Linkedin { get; set; }

        [JsonProperty("facebook")]
        [JsonPropertyName("facebook")]
        [FirestoreProperty]
        public string? Facebook { get; set; }

        [JsonProperty("twitter")]
        [JsonPropertyName("twitter")]
        [FirestoreProperty]
        public string? Twitter { get; set; }

        [JsonProperty("instagram")]
        [JsonPropertyName("instagram")]
        [FirestoreProperty]
        public string? Instagram { get; set; }

        [JsonProperty("youtube")]
        [JsonPropertyName("youtube")]
        [FirestoreProperty]
        public string? Youtube { get; set; }
    }
}