using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Reviews.Core.Models
{
	public class Genre
	{
		public Guid Id { get; set; }

		[MaxLength(25)]
		public string Name { get; set; } = string.Empty;

		[JsonIgnore]
		public ICollection<Movie>? Movies { get; set; }
	}
}
