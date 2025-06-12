namespace Reviews.API.Contracts.Requests
{
	public class ReviewRequest
	{
		public Guid Id { get; set; }
		public int Point { get; set; }
		public string Text { get; set; } = string.Empty;
		public Guid MovieId { get; set; }
	}
}
