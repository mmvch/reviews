namespace Reviews.Core.DTO
{
	public class SimpleReaction
	{
		public bool IsLiked { get; set; }
		public Guid ReviewId { get; set; }
	}
}
