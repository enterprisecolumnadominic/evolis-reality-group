using System.ComponentModel.DataAnnotations;

namespace house_proj.Server.Data
{
    public class CosmosSettings
    {
        [Required]
        public string ConnectionString { get; set; } = string.Empty;

        [Required]
        public string DatabaseName { get; set; } = string.Empty;

        [Required]
        public string PropertiesContainer { get; set; } = string.Empty;

        [Required]
        public string EmployeesContainer { get; set; } = string.Empty;

        [Required]
        public string ContentContainer { get; set; } = string.Empty;

        [Required]
        public string PartitionKeyPath { get; set; } = "/partitionKey"; // Default value is often good here
    }
}
