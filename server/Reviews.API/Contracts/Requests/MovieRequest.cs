namespace Reviews.API.Contracts.Requests
{
	public class MovieRequest
	{
		public Guid Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public DateTime ReleaseDate { get; set; }
		public ICollection<Guid>? Genres { get; set; }
		public IFormFile? Image { get; set; }
	}
}
