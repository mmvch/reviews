using Reviews.Core.DTO;
using Reviews.Core.DTO.Filters;
using Reviews.Core.Models;
using System.Security.Claims;

namespace Reviews.Application.Services.Interfaces
{
	public interface IUserService
	{
		Task<PartialData<User>> GetFilteredListAsync(UserFilter filter);
		Task<User> GetUserAsync(ClaimsPrincipal claims);
		Task ChangeRoleAsync(Guid userId, string roleName);
	}
}
