namespace Reviews.Core.Models
{
	public class Rating
	{
		public int Point { get; set; }
		public Guid UserId { get; set; }
		public User? User { get; set; }
		public Guid MovieId { get; set; }
		public Movie? Movie { get; set; }
	}
}
