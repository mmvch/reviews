using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Reviews.Core.Models
{
	public class Review
	{
		public Guid Id { get; set; }

		public int Point { get; set; }

		[MaxLength(500)]
		public string Text { get; set; } = string.Empty;

		public DateTime CreationDate { get; set; }

		public Guid UserId { get; set; }

		public User? User { get; set; }

		public Guid MovieId { get; set; }

		[JsonIgnore]
		public Movie? Movie { get; set; }

		[NotMapped]
		public int Likes => Reactions?.Count(ur => ur.IsLiked) ?? 0;

		[NotMapped]
		public int Dislikes => Reactions?.Count(ur => !ur.IsLiked) ?? 0;

		[JsonIgnore]
		public ICollection<ReviewReaction>? Reactions { get; set; }
	}
}
