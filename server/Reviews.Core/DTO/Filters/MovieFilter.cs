namespace Reviews.Core.DTO.Filters
{
	public class MovieFilter : PaginationFilter
	{
		public string? Name { get; set; }
		public Guid[]? GenreIds { get; set; }
	}
}
