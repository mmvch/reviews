using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Reviews.Core.Models
{
	public class User
	{
		public Guid Id { get; set; }

		[MaxLength(50)]
		public string Name { get; set; } = string.Empty;

		[JsonIgnore]
		[MaxLength(65)]
		public string PasswordHash { get; set; } = string.Empty;

		public Guid RoleId { get; set; }

		public Role? Role { get; set; }

		[JsonIgnore]
		public ICollection<Review>? Reviews { get; set; }

		[JsonIgnore]
		public ICollection<Rating>? Ratings { get; set; }

		[JsonIgnore]
		public ICollection<ReviewReaction>? Reactions { get; set; }
	}
}
