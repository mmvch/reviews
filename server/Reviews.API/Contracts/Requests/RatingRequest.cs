namespace Reviews.API.Contracts.Requests
{
	public class RatingRequest
	{
		public Guid MovieId { get; set; }
		public int Point { get; set; }
	}
}
