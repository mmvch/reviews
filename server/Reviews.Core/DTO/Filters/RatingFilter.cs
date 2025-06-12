namespace Reviews.Core.DTO.Filters
{
	public class RatingFilter : PaginationFilter
	{
		public Guid? MovieId { get; set; }
		public string? RoleName { get; set; }
	}
}
