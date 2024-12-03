using Reviews.Core.Models;

namespace Reviews.Infrastructure.Services.Interfaces
{
	public interface IJwtProvider
	{
		string GenerateToken(User user);
	}
}
