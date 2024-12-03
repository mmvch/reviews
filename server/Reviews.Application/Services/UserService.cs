using Reviews.Application.Services.Interfaces;
using Reviews.Core.DTO;
using Reviews.Core.DTO.Filters;
using Reviews.Core.Exceptions;
using Reviews.Core.Extensions;
using Reviews.Core.Models;
using Reviews.Persistence.Repositories.Interfaces;
using System.Net;
using System.Security.Claims;

namespace Reviews.Application.Services
{
	public class UserService : IUserService
	{
		private readonly IUserRepository _userRepository;
		private readonly IRoleRepository _roleRepository;

		public UserService(IUserRepository userRepository, IRoleRepository roleRepository)
		{
			_userRepository = userRepository;
			_roleRepository = roleRepository;
		}

		public async Task<PartialData<User>> GetFilteredListAsync(UserFilter filter)
		{
			if (!string.IsNullOrWhiteSpace(filter.RoleName))
			{
				_ = await _roleRepository.GetByNameAsync(filter.RoleName)
					?? throw new ServiceException("Invalid user role", HttpStatusCode.NotFound);
			}

			return await _userRepository.GetFilteredListAsync(
				filter.GetPredicate(),
				filter.CurrentPage * filter.PageSize,
				filter.PageSize,
				user => user.Role
			);
		}

		public async Task<User> GetUserAsync(ClaimsPrincipal claims)
		{
			if (!Guid.TryParse(claims.FindFirst(ClaimTypes.NameIdentifier)?.Value, out Guid userId))
			{
				throw new ServiceException("Invalid authorization token", HttpStatusCode.Unauthorized);
			}

			return await _userRepository.GetByIdAsync(userId)
				?? throw new ServiceException("Invalid authorization token", HttpStatusCode.Unauthorized);
		}

		public async Task ChangeRoleAsync(Guid userId, string roleName)
		{
			User user = await _userRepository.GetByIdAsync(userId)
				?? throw new ServiceException("User does not exist", HttpStatusCode.NotFound);

			Role role = await _roleRepository.GetByNameAsync(roleName)
				?? throw new ServiceException("Role does not exist", HttpStatusCode.NotFound);

			user.RoleId = role.Id;
			await _userRepository.UpdateAsync(user);
		}
	}
}
