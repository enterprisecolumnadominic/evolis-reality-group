using System.Text.Json.Serialization;

namespace house_proj.Server.Data.Model
{
    public class PagedResponse<T>
    {
        [JsonPropertyName("items")]
        public IEnumerable<T> Items { get; set; } = new List<T>();

        [JsonPropertyName("totalCount")]
        public int TotalCount { get; set; }

        [JsonPropertyName("totalPages")]
        public int TotalPages { get; set; }

        [JsonPropertyName("currentPage")]
        public int CurrentPage { get; set; }

        [JsonPropertyName("pageSize")]
        public int PageSize { get; set; }

        [JsonPropertyName("nextToken")]
        public string? NextToken { get; set; }

        [JsonPropertyName("hasMore")]
        public bool HasMore => !string.IsNullOrEmpty(NextToken);
    }

    public class PropertySearchRequest
    {
        public int PageSize { get; set; } = 12;
        public string? NameTerm { get; set; }
        public string? AddressTerm { get; set; }
        public PropertyType? Type { get; set; }
        public SubPropertyType? SubType { get; set; }
        public bool? IsEnabled { get; set; }
        public string? ContinuationToken { get; set; } // The raw JSON string goes here
    }
}
