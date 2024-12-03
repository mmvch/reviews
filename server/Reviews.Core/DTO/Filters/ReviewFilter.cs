namespace Reviews.Core.DTO.Filters
{
	public class ReviewFilter : PaginationFilter
	{
		public Guid? MovieId { get; set; }
	}
}
