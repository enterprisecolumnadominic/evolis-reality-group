using Microsoft.Azure.Cosmos;

namespace house_proj.Server.Extensions
{
    public static class DbInitializer
    {
        public static async Task InitializeCosmosDbAsync(this IHost host)
        {
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var configuration = services.GetRequiredService<IConfiguration>();
                var client = services.GetRequiredService<CosmosClient>();

                var cosmosSettings = configuration.GetSection("CosmosSettings");
                string databaseName = cosmosSettings["DatabaseName"]!;
                string partitionKey = cosmosSettings["PartitionKeyPath"] ?? "/id";

                // 1. Define the list of containers you want to ensure exist
                var containersToCreate = new Dictionary<string, string>
                {
                    { cosmosSettings["PropertiesContainer"]!, "/id" },
                    { cosmosSettings["EmployeesContainer"]!, "/id" },
                    { cosmosSettings["ContentContainer"]!, "/type" }
                };

                try
                {
                    // 2. Create Database
                    var dbResponse = await client.CreateDatabaseIfNotExistsAsync(databaseName);
                    var database = dbResponse.Database;

                    // 3. Loop through and create each container
                    foreach (var entry in containersToCreate)
                    {
                        string containerName = entry.Key;
                        string pKey = entry.Value;

                        await database.CreateContainerIfNotExistsAsync(containerName, pKey);
                        Console.WriteLine($"Container Checked/Created: {containerName} (PK: {pKey})");
                    }

                    Console.WriteLine($"Cosmos DB Initialization Successful for: {databaseName}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Cosmos DB Initialization Failed: {ex.Message}");
                }
            }
        }
    }
}