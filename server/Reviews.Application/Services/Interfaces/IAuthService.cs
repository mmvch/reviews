using Reviews.Core.DTO;

namespace Reviews.Application.Services.Interfaces
{
	public interface IAuthService
	{
		Task<string> RegisterAsync(Credentials credentials);
		Task<string> LoginAsync(Credentials credentials);
	}
}
