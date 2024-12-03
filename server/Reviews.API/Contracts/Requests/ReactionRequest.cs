namespace Reviews.API.Contracts.Requests
{
	public class ReactionRequest
	{
		public Guid ReviewId { get; set; }
		public bool IsLiked { get; set; }
	}
}
