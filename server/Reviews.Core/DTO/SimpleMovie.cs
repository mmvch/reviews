namespace Reviews.Core.DTO
{
	public class SimpleMovie
	{
		public Guid Id { get; set; }
		public Guid[] GenreIds { get; set; } = [];
	}
}
