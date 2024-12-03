using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Reviews.Core.Models
{
	public class Movie
	{
		public Guid Id { get; set; }

		[MaxLength(100)]
		public string Name { get; set; } = string.Empty;

		[MaxLength(500)]
		public string Description { get; set; } = string.Empty;

		public DateTime ReleaseDate { get; set; }

		[MaxLength(45)]
		public string? PosterFileName { get; set; }

		public ICollection<Genre>? Genres { get; set; }

		[JsonIgnore]
		public ICollection<Review>? Reviews { get; set; }

		[JsonIgnore]
		public ICollection<Rating>? Ratings { get; set; }
	}
}
