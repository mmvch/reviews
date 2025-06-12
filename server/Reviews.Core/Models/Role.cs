using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Reviews.Core.Models
{
	public class Role
	{
		public Guid Id { get; set; }

		[MaxLength(10)]
		public string Name { get; set; } = string.Empty;

		[JsonIgnore]
		public ICollection<User>? Users { get; set; }
	}
}
