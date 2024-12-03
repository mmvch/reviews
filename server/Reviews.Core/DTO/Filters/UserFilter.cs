namespace Reviews.Core.DTO.Filters
{
	public class UserFilter : PaginationFilter
	{
		public string? Name { get; set; }
		public string? RoleName { get; set; }
	}
}
