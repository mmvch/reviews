namespace Reviews.API.Contracts.Responses
{
	public class MovieResponse
	{
		public Guid Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public DateTime ReleaseDate { get; set; }
		public string? PosterFileName { get; set; }
		public int Score { get; set; }
	}
}
