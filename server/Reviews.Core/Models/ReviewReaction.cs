namespace Reviews.Core.Models
{
	public class ReviewReaction
	{
		public bool IsLiked { get; set; }
		public Guid UserId { get; set; }
		public User? User { get; set; }
		public Guid ReviewId { get; set; }
		public Review? Review { get; set; }
	}
}
