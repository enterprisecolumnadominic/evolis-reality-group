using Google.Cloud.Firestore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace house_proj.Server.Data.Model
{
    [FirestoreData]
    public class EmailRequest
    {
        [JsonPropertyName("name")]
        [FirestoreProperty]
        public string Name { get; set; } = string.Empty;
        [EmailAddress]
        [JsonPropertyName("email")]
        [FirestoreProperty]
        public string Email { get; set; } = string.Empty;
        [Phone]
        [JsonPropertyName("phone")]
        [FirestoreProperty]
        public  string Phone { get; set; } = string.Empty;
        [Required]
        [JsonPropertyName("message")]
        [FirestoreProperty]
        public required string Message { get; set; } = string.Empty;
        [Required]
        [JsonPropertyName("propertyName")]
        [FirestoreProperty]
        public required string PropertyName { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("employeeEmail")] 
        [FirestoreProperty]
        public string EmployeeEmail { get; set; } = string.Empty;

        [JsonPropertyName("captchaToken")]
        [FirestoreProperty]
        public  string CaptchaToken { get; set; } = string.Empty;
    }

    public class PreQualifyRequest
    {
        [Required]
        [JsonPropertyName("captchaToken")]
        public string CaptchaToken { get; set; } = string.Empty;

        // --- Property Information ---
        [Required]
        [JsonPropertyName("propertyType")]
        public string PropertyType { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("propertyStatus")]
        public string PropertyStatus { get; set; } = string.Empty;

        [Range(0, double.MaxValue)]
        [JsonPropertyName("propertyValue")]
        public decimal PropertyValue { get; set; }

        // --- Loan Details ---
        [Required]
        [JsonPropertyName("loanTenure")]
        public int LoanTenure { get; set; }

        // --- Employment Information ---
        [Required]
        [JsonPropertyName("employmentType")]
        public string EmploymentType { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("employmentStatus")]
        public string EmploymentStatus { get; set; } = string.Empty;

        [JsonPropertyName("yearsEmployed")]
        public int YearsEmployed { get; set; }

        [Range(0, double.MaxValue)]
        [JsonPropertyName("monthlyIncome")]
        public decimal MonthlyIncome { get; set; }

        // --- Personal Information ---
        [Required]
        [StringLength(100)]
        [JsonPropertyName("firstName")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [JsonPropertyName("lastName")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("dateOfBirth")]
        public DateTime DateOfBirth { get; set; }

        [Required]
        [JsonPropertyName("civilStatus")]
        public string CivilStatus { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(10)]
        [JsonPropertyName("countryCode")]
        public string CountryCode { get; set; } = string.Empty;

        [Required]
        [Phone]
        [JsonPropertyName("phoneNumber")]
        public string PhoneNumber { get; set; } = string.Empty;

        [JsonIgnore]
        public string FullPhoneNumber => $"{CountryCode}{PhoneNumber}";
    }
}
